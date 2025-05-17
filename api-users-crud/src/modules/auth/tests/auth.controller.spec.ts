import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../services/auth.service';
import { UserStub } from '../../users/stubs/user.stub';

describe('AuthController', () => {
    let controller: AuthController;

    const authService = {
        signup: jest.fn(),
        login: jest.fn(),
        forgotPassword: jest.fn(),
        resetPassword: jest.fn(),
        profile: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: authService,
                },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
    });

    it('should be defined', async () => {
        expect(controller).toBeDefined();
    });

    describe('signup', () => {
        it('should be defined', () => {
            expect(controller.signup).toBeDefined();
        });

        it('should call authService.signup', async () => {
            const user = new UserStub();

            await controller.signup(user.requestDto);

            expect(authService.signup).toHaveBeenCalledTimes(1);
            expect(authService.signup).toHaveBeenCalledWith(user.requestDto);
        });
    });

    describe('login', () => {
        it('should be defined', () => {
            expect(controller.login).toBeDefined();
        });

        it('should call authService.login', async () => {
            const user = new UserStub();

            await controller.login(user);

            expect(authService.login).toHaveBeenCalledTimes(1);
            expect(authService.login).toHaveBeenCalledWith(user.id);
        });
    });

    describe('forgot-password', () => {
        it('should be defined', () => {
            expect(controller.forgotPassword).toBeDefined();
        });

        it('should call authService.forgotPassword', async () => {
            const user = new UserStub();

            await controller.forgotPassword({ email: user.email });

            expect(authService.forgotPassword).toHaveBeenCalledTimes(1);
            expect(authService.forgotPassword).toHaveBeenCalledWith(user.email);
        });
    });

    describe('reset-password', () => {
        it('should be defined', () => {
            expect(controller.resetPassword).toBeDefined();
        });

        it('should call authService.resetPassword', async () => {
            const user = new UserStub();
            const payload = {
                id: user.id,
                access_token: 'access_token',
                password: 'new-password',
            };

            await controller.resetPassword(payload);

            expect(authService.resetPassword).toHaveBeenCalledTimes(1);
            expect(authService.resetPassword).toHaveBeenCalledWith(payload);
        });
    });

    describe('profile', () => {
        it('should be defined', () => {
            expect(controller.profile).toBeDefined();
        });

        it('should call authService.profile', async () => {
            const user = new UserStub();

            await controller.profile(user);

            expect(authService.profile).toHaveBeenCalledTimes(1);
            expect(authService.profile).toHaveBeenCalledWith(user.id);
        });
    });
});
