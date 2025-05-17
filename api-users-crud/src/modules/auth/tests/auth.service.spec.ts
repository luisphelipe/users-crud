import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { bcryptServiceMock } from '../../../common/bcrypt/mocks/bcrypt.service.mock';
import { BcryptService } from '../../../common/bcrypt/services/bcrypt.service';
import { sendEmailServiceMock } from '../../../common/mailer/mocks/send-email.service.mock';
import { SendEmailService } from '../../../common/mailer/services/send-email.service';
import { userRepositoryMock } from '../../users/mocks/user.repository.mock';
import {
    UserStub,
    accessTokenStub,
    jwtSecretKeyStub,
    passwordHashStub,
    passwordStub,
    userSecretStub,
} from '../../users/stubs/user.stub';
import { UserRepository } from '../../users/user.repository';
import { jwtServiceMock } from '../mocks/jwt.service.mock';
import { AuthService } from '../services/auth.service';
import { ConfigModule } from '@nestjs/config';
import { userServiceMock } from '../../users/mocks/user.service.mock';
import { UserService } from '../../users/user.service';

describe('AuthService', () => {
    let service: AuthService;

    const bcryptService = bcryptServiceMock(),
        jwtService = jwtServiceMock(),
        sendEmailService = sendEmailServiceMock(),
        userRepository = userRepositoryMock(),
        userService = userServiceMock();

    beforeAll(() => {
        process.env.JWT_SECRET_KEY = jwtSecretKeyStub();
    });

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    envFilePath: `.env.${process.env.NODE_ENV}`,
                }),
            ],
            providers: [
                AuthService,
                { provide: BcryptService, useValue: bcryptService },
                { provide: JwtService, useValue: jwtService },
                { provide: SendEmailService, useValue: sendEmailService },
                { provide: UserRepository, useValue: userRepository },
                { provide: UserService, useValue: userService },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('signup', () => {
        it('should be defined', () => {
            expect(service.signup).toBeDefined();
        });

        it('calls userService.create', async () => {
            const user = new UserStub();
            userService.create.mockResolvedValueOnce(user.serialized);

            await service.signup(user.requestDto);

            expect(userService.create).toHaveBeenCalledTimes(1);
            expect(userService.create).toHaveBeenCalledWith(user.requestDto);
        });

        it('calls service.login', async () => {
            const user = new UserStub();
            service.login = jest.fn();
            userService.create.mockResolvedValueOnce(user.serialized);

            await service.signup(user.requestDto);

            expect(service.login).toHaveBeenCalledTimes(1);
            expect(service.login).toHaveBeenCalledWith(user.id);
        });
    });

    describe('verifyIfUserExists', () => {
        it('throws NotFoundException if not user', () => {
            const act = () => service.verifyIfUserExists(null);

            expect(act).toThrow(NotFoundException);
        });

        it('do nothing if user exists', () => {
            const user: any = new UserStub();
            const result = service.verifyIfUserExists(user);

            expect(result).toEqual(undefined);
        });
    });

    describe('verifyUserPassword', () => {
        const password = passwordStub();
        const passwordHash = passwordHashStub(password);

        it('calls bcryptService.compareSync', () => {
            service.verifyUserPassword(password, passwordHash);

            expect(bcryptService.compareSync).toHaveBeenCalledTimes(1);
            expect(bcryptService.compareSync).toHaveBeenCalledWith(password, passwordHash);
        });

        it('throws an error if compareSync returns false', () => {
            bcryptService.compareSync.mockReturnValueOnce(false);

            const act = () => service.verifyUserPassword(password, passwordHash);

            expect(act).toThrow(UnauthorizedException);
        });

        it('should return nothing if compareSync returns true', () => {
            const result = service.verifyUserPassword(password, passwordHash);

            expect(result).toEqual(undefined);
        });
    });

    describe('findUser', () => {
        const user = new UserStub();
        const user_query = { email: { equals: user.email, mode: 'insensitive' as const } };

        beforeEach(() => {
            userRepository.findOneWithPassword.mockResolvedValueOnce(user);
        });

        it('calls userRepository.findUser with user email', async () => {
            await service.findUser(user_query);

            expect(userRepository.findOneWithPassword).toHaveBeenCalledTimes(1);
            expect(userRepository.findOneWithPassword).toHaveBeenCalledWith(user_query);
        });

        it('calls verifyIfUserExists', async () => {
            service.verifyIfUserExists = jest.fn();

            await service.findUser(user_query);

            expect(service.verifyIfUserExists).toHaveBeenCalledTimes(1);
            expect(service.verifyIfUserExists).toHaveBeenCalledWith(user);
        });

        it('returns user', async () => {
            service.verifyIfUserExists = jest.fn();

            const result = await service.findUser(user_query);

            expect(result).toEqual(user);
        });
    });

    describe('validateUser', () => {
        let user: UserStub, password: string;

        beforeEach(() => {
            user = new UserStub();
            password = passwordStub();

            service.verifyUserPassword = jest.fn().mockReturnValueOnce(true);
            service.findUser = jest.fn().mockResolvedValueOnce(user);
        });

        it('calls findUser', async () => {
            await service.validateUser(user.email, password);

            expect(service.findUser).toHaveBeenCalledTimes(1);
            expect(service.findUser).toHaveBeenCalledWith({
                email: { equals: user.email, mode: 'insensitive' },
            });
        });

        it('calls verifyUserPassword', async () => {
            await service.validateUser(user.email, password);

            expect(service.verifyUserPassword).toHaveBeenCalledTimes(1);
            expect(service.verifyUserPassword).toHaveBeenCalledWith(password, user.password);
        });

        it('returns user', async () => {
            const result = await service.validateUser(user.email, password);
            expect(result).toEqual(user.serialized);
        });
    });

    describe('buildAccessToken', () => {
        it('calls jwtService.sign with user serialized data', async () => {
            const user = new UserStub();
            service.buildAccessToken(user.serialized);

            expect(jwtService.sign).toHaveBeenCalledTimes(1);
            expect(jwtService.sign).toHaveBeenCalledWith(user.serialized, undefined);
        });

        it('returns generated access_token', () => {
            const user = new UserStub();
            const result = service.buildAccessToken(user.serialized);

            expect(result).toEqual(accessTokenStub());
        });
    });

    describe('login', () => {
        let user: UserStub;

        beforeEach(() => {
            user = new UserStub();
            service.buildAccessToken = jest.fn().mockReturnValueOnce(accessTokenStub());
            userRepository.findOne = jest.fn().mockResolvedValueOnce(user.serialized);
        });

        it('calls userRepository.findOne', async () => {
            await service.login(user.id);

            expect(userRepository.findOne).toHaveBeenCalledTimes(1);
            expect(userRepository.findOne).toHaveBeenCalledWith({
                id: user.id,
            });
        });

        it('calls buildAccessToken', async () => {
            await service.login(user.id);

            expect(service.buildAccessToken).toHaveBeenCalledTimes(1);
            expect(service.buildAccessToken).toHaveBeenCalledWith(user.serialized);
        });

        it('returns access_token and user', async () => {
            const result = await service.login(user.id);

            expect(result).toEqual({
                access_token: accessTokenStub(),
                user: user.serialized,
            });
        });
    });

    describe('buildUserCustomSecret', () => {
        it('returns a custom secret string', () => {
            const user = new UserStub();
            const result = service.buildUserCustomSecret(user);
            expect(result).toEqual(userSecretStub(user.password));
        });
    });

    describe('sendResetPasswordEmail', () => {
        let user: UserStub;

        beforeEach(async () => {
            user = new UserStub();

            await service.sendPasswordResetEmail({
                id: user.id,
                email: user.email,
                access_token: accessTokenStub(),
            });
        });

        it('calls sendEmailService.commit', async () => {
            expect(sendEmailService.commit).toHaveBeenCalledTimes(1);
        });

        it('email body includes id and access_token', async () => {
            expect(sendEmailService.commit).toHaveBeenCalledWith({
                to: user.email,
                subject: 'Redefinição de senha',
                text:
                    `Acesse o link para redefinir sua senha:` +
                    `\n\n` +
                    `http://localhost:3000/auth/reset-password?id=${user.id}&access-token=encrypted_data`,
            });
        });
    });

    describe('forgotPassword', () => {
        let result: any, user: UserStub;

        beforeEach(async () => {
            user = new UserStub();
            service.findUser = jest.fn().mockReturnValueOnce(user);
            service.buildUserCustomSecret = jest.fn().mockReturnValueOnce(userSecretStub());
            service.buildAccessToken = jest.fn().mockReturnValueOnce(accessTokenStub());
            service.sendPasswordResetEmail = jest.fn();
            userRepository.serializeUser = jest.fn().mockReturnValueOnce(user.serialized);

            result = await service.forgotPassword(user.email);
        });

        it('calls findUser', () => {
            expect(service.findUser).toHaveBeenCalledTimes(1);
            expect(service.findUser).toHaveBeenCalledWith({
                email: { equals: user.email, mode: 'insensitive' },
            });
        });

        it('calls buildUserCustomSecret', () => {
            expect(service.buildUserCustomSecret).toHaveBeenCalledTimes(1);
            expect(service.buildUserCustomSecret).toHaveBeenCalledWith(user);
        });

        it('calls serializeUser', () => {
            expect(userRepository.serializeUser).toHaveBeenCalledTimes(1);
            expect(userRepository.serializeUser).toHaveBeenCalledWith(user);
        });

        it('calls buildAccessToken', () => {
            expect(service.buildAccessToken).toHaveBeenCalledTimes(1);
            expect(service.buildAccessToken).toHaveBeenCalledWith(user.serialized, {
                secret: userSecretStub(),
            });
        });

        it('calls sendPasswordResetEmail', () => {
            expect(service.sendPasswordResetEmail).toHaveBeenCalledTimes(1);
            expect(service.sendPasswordResetEmail).toHaveBeenCalledWith({
                id: user.id,
                email: user.email,
                access_token: accessTokenStub(),
            });
        });

        it('returns a success message', () => {
            expect(result).toEqual({
                message: 'successfully sent password reset link to user email',
            });
        });
    });

    describe('resetPassword', () => {
        let user: UserStub, result: any;
        const password = passwordStub('b');

        beforeEach(async () => {
            user = new UserStub();
            service.findUser = jest.fn().mockReturnValue(user.serialized);
            service.buildUserCustomSecret = jest.fn().mockReturnValueOnce(userSecretStub());

            result = await service.resetPassword({
                id: user.id,
                password: password,
                access_token: accessTokenStub(),
            });
        });

        it('calls findUser', () => {
            expect(service.findUser).toHaveBeenCalledTimes(1);
            expect(service.findUser).toHaveBeenCalledWith({ id: user.id });
        });

        it('calls buildUserCustomSecret', () => {
            expect(service.buildUserCustomSecret).toHaveBeenCalledTimes(1);
            expect(service.buildUserCustomSecret).toHaveBeenCalledWith(user.serialized);
        });

        it('calls jwtservice.verifyAsync with given access_token', () => {
            expect(jwtService.verifyAsync).toHaveBeenCalledTimes(1);
            expect(jwtService.verifyAsync).toHaveBeenCalledWith(accessTokenStub(), {
                secret: userSecretStub(),
            });
        });

        it("shouldn't call userRepository.hashPassword", () => {
            expect(userRepository.hashPassword).toHaveBeenCalledTimes(0);
        });

        it('calls userRepository.update with new password', () => {
            expect(userRepository.update).toHaveBeenCalledTimes(1);
            expect(userRepository.update).toHaveBeenCalledWith({ id: user.id }, { password });
        });

        it('returns a the user and the new access_token', () => {
            expect(result).toEqual({
                access_token: 'encrypted_data',
                user: undefined,
            });
        });
    });
});
