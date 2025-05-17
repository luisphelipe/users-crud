import { Test, TestingModule } from '@nestjs/testing';
import { userServiceMock } from '../mocks/user.service.mock';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { UserStub } from '../stubs/user.stub';

describe('UserController', () => {
    let controller: UserController;
    const userService = userServiceMock();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [{ provide: UserService, useValue: userService }],
        }).compile();

        controller = module.get<UserController>(UserController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should be defined', () => {
            expect(controller.create).toBeDefined();
        });

        it('should call userService.create', async () => {
            // Arrange
            const userStub = new UserStub();

            // Act
            await controller.create(userStub.requestDto);

            // Assert
            expect(userService.create).toHaveBeenCalledTimes(1);
            expect(userService.create).toHaveBeenCalledWith(userStub.requestDto);
        });
    });

    describe('findAll', () => {
        it('should be defined', () => {
            expect(controller.findAll).toBeDefined();
        });

        it('should call userService.findAll', async () => {
            await controller.findAll({ page: 1, perPage: 10 });

            expect(userService.findAll).toHaveBeenCalledTimes(1);
            expect(userService.findAll).toHaveBeenCalledWith({ page: 1, perPage: 10 });
        });
    });

    describe('findOne', () => {
        it('should be defined', () => {
            expect(controller.findOne).toBeDefined();
        });

        it('should call userService.findOne', async () => {
            await controller.findOne('user-id');

            expect(userService.findOne).toHaveBeenCalledTimes(1);
            expect(userService.findOne).toHaveBeenCalledWith('user-id');
        });
    });

    describe('update', () => {
        it('should be defined', () => {
            expect(controller.update).toBeDefined();
        });

        it('should call userService.udpate', async () => {
            const userStub = new UserStub();

            await controller.update('user-id', userStub.requestDto);

            expect(userService.update).toHaveBeenCalledTimes(1);
            expect(userService.update).toHaveBeenCalledWith('user-id', userStub.requestDto);
        });
    });

    describe('remove', () => {
        it('should be defined', () => {
            expect(controller.remove).toBeDefined();
        });

        it('should call userService.remove', async () => {
            await controller.remove('user-id');

            expect(userService.remove).toHaveBeenCalledTimes(1);
            expect(userService.remove).toHaveBeenCalledWith('user-id');
        });
    });
});
