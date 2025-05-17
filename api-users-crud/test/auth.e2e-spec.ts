import { HttpStatus } from '@nestjs/common';
import { User } from '@prisma/client';
import request from 'supertest';

import { setupApp } from './test.utils';
import { PrismaService } from '../src/common/prisma/prisma.service';
import { UserRepository } from '../src/modules/users/user.repository';
import { AuthService } from '../src/modules/auth/services/auth.service';
import { SendEmailService } from '../src/common/mailer/services/send-email.service';
import { UserStub } from '../src/modules/users/stubs/user.stub';
import { objectWithMessage } from '../src/common/utils/test.utils';

jest.mock('../src/common/mailer/services/send-email.service');

describe('Auth', () => {
    let prismaService: PrismaService,
        userRepository: UserRepository,
        authService: AuthService,
        sendEmailService: SendEmailService;
    let httpService: any;
    let app: any;

    beforeAll(async () => {
        const { _app, moduleRef, _httpService } = await setupApp();

        app = _app;
        httpService = _httpService;

        prismaService = moduleRef.get(PrismaService);
        userRepository = moduleRef.get(UserRepository);
        authService = moduleRef.get(AuthService);
        sendEmailService = moduleRef.get(SendEmailService);
    });

    afterAll(async () => {
        await app.close();
    });

    afterEach(async () => {
        await prismaService.user.deleteMany();
    });

    describe('post /signup', () => {
        describe('on failure', () => {
            it('validates user email', async () => {
                const user = new UserStub();
                const payload = { password: user.password, name: user.name };

                const response = await request(httpService).post('/auth/signup').send(payload);

                expect(response.status).toBe(HttpStatus.BAD_REQUEST);
                expect(response.body).toHaveProperty('error', 'Bad Request');
                expect(response.body).toHaveProperty('message');
                expect(response.body.message).toEqual(['email must be an email']);
            });

            it('validates user password', async () => {
                const user = new UserStub();
                const payload = { email: user.email, name: user.name };

                const response = await request(httpService).post('/auth/signup').send(payload);

                expect(response.status).toBe(HttpStatus.BAD_REQUEST);
                expect(response.body).toHaveProperty('error', 'Bad Request');
                expect(response.body).toHaveProperty('message');
                expect(response.body.message).toEqual([
                    'password must be longer than or equal to 8 characters',
                    'password must be a string',
                ]);
            });

            it('validates user name', async () => {
                const user = new UserStub();
                const payload = { email: user.email, password: user.password };

                const response = await request(httpService).post('/auth/signup').send(payload);

                expect(response.status).toBe(HttpStatus.BAD_REQUEST);
                expect(response.body).toHaveProperty('error', 'Bad Request');
                expect(response.body).toHaveProperty('message');
                expect(response.body.message).toEqual(['name should not be empty', 'name must be a string']);
            });
        });

        describe('on success', () => {
            it('creates an user', async () => {
                const user = new UserStub();
                const user_count = await prismaService.user.count();

                await request(httpService).post('/auth/signup').send(user.query);

                expect(await prismaService.user.count()).toBe(user_count + 1);
            });

            it('returns the access_token and user', async () => {
                const user = new UserStub();

                const response = await request(httpService).post('/auth/signup').send(user.query);

                expect(response.status).toBe(HttpStatus.CREATED);

                expect(response.body).toMatchObject({
                    access_token: expect.any(String),
                    user: user.matching,
                });
            });
        });
    });

    describe('post /login', () => {
        it('returns 404 not found when user not found', async () => {
            const user = new UserStub();

            const response = await request(httpService).post('/auth/login').send({
                email: user.email,
                password: user.password,
            });

            expect(response.status).toEqual(HttpStatus.NOT_FOUND);
            expect(response.body).toEqual({
                error: 'Not Found',
                message: 'Usuário não encontrado.',
                statusCode: HttpStatus.NOT_FOUND,
            });
        });

        it('returns 401 unauthorized when wrong password', async () => {
            const user = new UserStub();
            await user.save(prismaService);

            const response = await request(httpService)
                .post('/auth/login')
                .send({
                    email: user.email,
                    password: 'wrong' + user.password,
                });

            expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
            expect(response.body).toEqual({
                error: 'Unauthorized',
                message: 'Senha incorreta.',
                statusCode: 401,
            });
        });

        describe('on success', () => {
            let user: any, response: any;

            beforeEach(async () => {
                user = new UserStub({ password: 'senha' });
                await user.save(prismaService, userRepository);

                response = await request(httpService).post('/auth/login').send({
                    email: user.email,
                    password: user.password,
                });
            });

            it('returns http_status created', () => {
                expect(response.status).toBe(HttpStatus.CREATED);
            });

            it('returns serialized user and access_token', () => {
                expect(response.body).toEqual({
                    access_token: expect.any(String),
                    user: user.serialized,
                });
            });

            it("returned user doesn't contain the password", () => {
                expect(response.body.user).not.toHaveProperty('password');
            });
        });
    });

    describe('post /forgot-password', () => {
        const user = new UserStub();

        describe('on success', () => {
            let response: any;

            beforeAll(async () => {
                jest.clearAllMocks();
                await user.save(prismaService);
                response = await request(httpService).post('/auth/forgot-password').send({ email: user.email });
            });

            it('returns a success message', async () => {
                expect(response.status).toEqual(HttpStatus.CREATED);
                expect(response.body).toEqual(objectWithMessage(/success/));
            });

            it('sends an email to the user email', async () => {
                expect(sendEmailService.commit).toHaveBeenCalled();
            });
        });

        describe('on failure', () => {
            let response: any;

            beforeAll(async () => {
                await user.save(prismaService);
                response = await request(httpService)
                    .post('/auth/forgot-password')
                    .send({ email: 'fake' + user.email });
            });

            it('returns 404 not found if there is no email', async () => {
                expect(response.status).toEqual(HttpStatus.NOT_FOUND);
                expect(response.body).toEqual({
                    error: 'Not Found',
                    message: 'Usuário não encontrado.',
                    statusCode: HttpStatus.NOT_FOUND,
                });
            });
        });
    });

    describe('post /reset-password', () => {
        let user: User, userStub: UserStub;

        beforeEach(async () => {
            userStub = new UserStub();
            await userStub.save(prismaService, userRepository);
            user = (await userRepository.findOneWithPassword({ id: userStub.id })) as User;
        });

        describe('with valid access_token', () => {
            let response: request.Response, access_token: string;

            beforeEach(async () => {
                access_token = authService.buildAccessToken(userStub.serialized, {
                    secret: authService.buildUserCustomSecret({ password: user.password }),
                });

                response = await request(httpService).post('/auth/reset-password').send({
                    id: user.id,
                    password: 'new_password',
                    access_token,
                });
            });

            it('updates the user password', async () => {
                const updated_user = (await userRepository.findOneWithPassword({
                    id: user.id,
                })) as User;

                expect(updated_user.password).not.toEqual(user.password);
            });

            it('returns login data with access_token and user', () => {
                expect(response.body).toEqual({
                    access_token: expect.any(String),
                    user: userStub.serialized,
                });

                expect(response.status).toEqual(HttpStatus.CREATED);
            });
        });

        describe('with invalid access_token', () => {
            let response: request.Response;

            beforeEach(async () => {
                const secondUserStub = new UserStub();
                await secondUserStub.save(prismaService);

                const other_access_token = authService.buildAccessToken(secondUserStub.serialized, {
                    secret: authService.buildUserCustomSecret({
                        password: 'fake-hash',
                    }),
                });

                response = await request(httpService).post('/auth/reset-password').send({
                    id: user.id,
                    password: 'new_password',
                    access_token: other_access_token,
                });
            });

            it('returns a 401 unauthorized when access_token is invalid', () => {
                expect(response.body).toEqual(objectWithMessage(/invalid signature/));
                expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
            });
        });
    });

    describe('get /profile', () => {
        describe('on failure', () => {
            it('returns 401 when no access_token is given', async () => {
                const response = await request(httpService).get('/auth/profile');

                expect(response.status).toBe(401);
                expect(response.body).toEqual({ statusCode: 401, message: 'Unauthorized' });
            });
        });

        describe('on success', () => {
            it('returns user data', async () => {
                const user = new UserStub();
                await user.save(prismaService);
                const access_token = authService.buildAccessToken(user.serialized);
                const auth_token = `Bearer ${access_token}`;
                const response = await request(httpService).get('/auth/profile').set('Authorization', auth_token);

                expect(response.status).toBe(200);
                expect(response.body).toEqual(expect.objectContaining({ user: user.serialized }));
            });
        });
    });
});
