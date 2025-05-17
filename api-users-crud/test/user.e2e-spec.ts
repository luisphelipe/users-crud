import { HttpStatus } from '@nestjs/common';
import request from 'supertest';

import { setupApp } from './test.utils';
import { PrismaService } from '../src/common/prisma/prisma.service';
import { UserRepository } from '../src/modules/users/user.repository';
import { UserStub } from '../src/modules/users/stubs/user.stub';

jest.mock('../src/common/mailer/services/send-email.service');

describe('User', () => {
    let prismaService: PrismaService, userRepository: UserRepository;
    let httpService: any;
    let app: any;

    beforeAll(async () => {
        const { _app, moduleRef, _httpService } = await setupApp();

        app = _app;
        httpService = _httpService;

        prismaService = moduleRef.get(PrismaService);
        userRepository = moduleRef.get(UserRepository);
    });

    afterAll(async () => {
        await app.close();
    });

    afterEach(async () => {
        await prismaService.user.deleteMany();
    });

    describe('get /users', () => {
        describe('on success', () => {
            it('returns an empty list of users', async () => {
                await prismaService.user.deleteMany();
                const response = await request(httpService).get('/users');

                expect(response.status).toBe(HttpStatus.OK);
                expect(response.body).toEqual({
                    meta: {
                        total: 0,
                        lastPage: 0,
                        currentPage: 1,
                        perPage: 10,
                        prev: null,
                        next: null,
                    },
                    data: [],
                });
            });

            // TODO: fix (failing due to caching)
            it.skip('returns a list of users', async () => {
                await prismaService.user.deleteMany();
                const user = await createUser();

                const response = await request(httpService).get('/users');

                expect(response.status).toBe(HttpStatus.OK);
                expect(response.body).toEqual({
                    meta: {
                        total: 1,
                        lastPage: 1,
                        currentPage: 1,
                        perPage: 10,
                        prev: null,
                        next: null,
                    },
                    data: [user.serialized],
                });
            });

            describe('with pagination', () => {
                it('returns only the first page', async () => {
                    await prismaService.user.deleteMany();
                    await createUser();
                    const user2 = await createUser();
                    const user3 = await createUser();

                    const response = await request(httpService).get('/users?perPage=2');

                    expect(response.status).toBe(HttpStatus.OK);
                    expect(response.body).toEqual({
                        meta: {
                            total: 3,
                            lastPage: 2,
                            currentPage: 1,
                            perPage: 2,
                            prev: null,
                            next: 2,
                        },
                        data: [user3.serialized, user2.serialized],
                    });
                });

                it('returns only the second page', async () => {
                    await prismaService.user.deleteMany();
                    const user1 = await createUser();
                    await createUser();
                    await createUser();

                    const response = await request(httpService).get('/users?perPage=2&page=2');

                    expect(response.status).toBe(HttpStatus.OK);
                    expect(response.body).toEqual({
                        meta: {
                            total: 3,
                            lastPage: 2,
                            currentPage: 2,
                            perPage: 2,
                            prev: 1,
                            next: null,
                        },
                        data: [user1.serialized],
                    });
                });
            });
        });
    });

    describe('post /users', () => {
        describe('on failure', () => {
            it('validates user email', async () => {
                const user = new UserStub();
                const payload = { password: user.password, name: user.name };

                const response = await request(httpService).post('/users').send(payload);

                expect(response.status).toBe(HttpStatus.BAD_REQUEST);
                expect(response.body).toHaveProperty('error', 'Bad Request');
                expect(response.body).toHaveProperty('message');
                expect(response.body.message).toEqual(['email must be an email']);
            });

            it('validates user password', async () => {
                const user = new UserStub();
                const payload = { email: user.email, name: user.name };

                const response = await request(httpService).post('/users').send(payload);

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

                const response = await request(httpService).post('/users').send(payload);

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

                await request(httpService).post('/users').send(user.query);

                expect(await prismaService.user.count()).toBe(user_count + 1);
            });

            it('returns the created user', async () => {
                const user = new UserStub();

                const response = await request(httpService).post('/users').send(user.query);

                expect(response.status).toBe(HttpStatus.CREATED);

                // expect(response.body).toMatchObject({
                //     access_token: expect.any(String),
                //     user: user.matching,
                // });

                expect(response.body).toMatchObject(user.matching);
            });
        });
    });

    describe('get /users/:id', () => {
        describe('on success', () => {
            it('returns serialized user', async () => {
                const user = await createUser();

                const response = await request(httpService).get('/users/' + user.id);

                expect(response.status).toBe(HttpStatus.OK);
                expect(response.body).toEqual(user.serialized);
            });

            it('returns not found error if there is no user with given id', async () => {
                const user = new UserStub();

                const response = await request(httpService).get(`/users/${user.id}`);

                // should this return with a "NOT FOUND" http status?
                expect(response.status).toBe(HttpStatus.NOT_FOUND);
                expect(response.body).toEqual({
                    error: 'Not Found',
                    message: 'Usuário não encontrado.',
                    statusCode: HttpStatus.NOT_FOUND,
                });
            });
        });
    });

    describe('put /users/:id', () => {
        describe('on failure', () => {
            it('validates user name', async () => {
                const user = await createUser();

                const payload = { name: 10 };
                const response = await request(httpService)
                    .put('/users/' + user.id)
                    .send(payload);

                expect(response.status).toBe(HttpStatus.BAD_REQUEST);
                expect(response.body).toHaveProperty('error', 'Bad Request');
                expect(response.body).toHaveProperty('message');
                expect(response.body.message).toEqual(['name must be a string']);
            });
        });

        describe('on success', () => {
            let response: request.Response;
            let user: UserStub;
            const payload = { name: 'updated_name' };

            beforeAll(async () => {
                user = await createUser();

                response = await request(httpService)
                    .put('/users/' + user.id)
                    .send(payload);
            });

            it('updates the user name', async () => {
                const dbUser = await userRepository.findOne({ id: user.id });

                expect(dbUser).toEqual({
                    ...user.serialized,
                    ...payload,
                });
            });

            it('returns updated user', async () => {
                expect(response.status).toBe(HttpStatus.OK);
                expect(response.body).toMatchObject({ ...user.serialized, ...payload });
            });
        });
    });

    describe('delete /users/:id', () => {
        describe('on failure', () => {
            it('returns 404 Not found if there is no user with given id', async () => {
                const user = new UserStub();

                const response = await request(httpService).delete(`/users/${user.id}`);

                expect(response.status).toBe(HttpStatus.NOT_FOUND);
                expect(response.body).toEqual({
                    message: 'Registro não encontrado.',
                    statusCode: 404,
                });
            });
        });

        describe('on success', () => {
            let user: UserStub;
            let response: request.Response;

            beforeEach(async () => {
                user = await createUser();
            });

            it('deletes the user', async () => {
                const user_count = await prismaService.user.count();

                response = await request(httpService).delete('/users/' + user.id);

                expect(await prismaService.user.count()).toBe(user_count - 1);
            });

            it('returns deleted user', async () => {
                response = await request(httpService).delete('/users/' + user.id);

                expect(response.status).toBe(HttpStatus.OK);
                expect(response.body).toEqual(user.serialized);
            });
        });
    });

    const createUser = async (data?: any) => {
        const user = new UserStub(data);
        await user.save(prismaService);
        return user;
    };
});
