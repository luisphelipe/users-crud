import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { UserStub } from '../stubs/user.stub';
import { userRepositoryMock } from '../mocks/user.repository.mock';
import { UserRepository } from '../user.repository';
import { cacheManagerMock } from '../mocks/cache.manager.mock';

describe('UserService', () => {
    let service: UserService;
    const userRepository = userRepositoryMock(),
        cacheManager = cacheManagerMock();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                { provide: UserRepository, useValue: userRepository },
                { provide: 'CACHE_MANAGER', useValue: cacheManager },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should be defined', () => {
            expect(service.create).toBeDefined();
        });

        it('should call userRepository.create', async () => {
            const userStub = new UserStub();

            await service.create(userStub.requestDto);

            expect(userRepository.create).toHaveBeenCalledTimes(1);
            expect(userRepository.create).toHaveBeenCalledWith(userStub.requestDto);
        });
    });

    describe('findAll', () => {
        it('should be defined', () => {
            expect(service.findAll).toBeDefined();
        });

        describe('should call userRepository.paginate', () => {
            it('with page param', async () => {
                userRepository.paginate.mockClear();

                await service.findAll({ page: 1, perPage: 10 });

                expect(userRepository.paginate).toHaveBeenCalledTimes(1);
                expect(userRepository.paginate).toHaveBeenCalledWith({}, { page: 1, perPage: 10 });
            });
        });
    });

    describe('findOne', () => {
        it('should be defined', () => {
            expect(service.findOne).toBeDefined();
        });

        it('should call userRepository.findOne', async () => {
            await service.findOne('user-id');

            expect(userRepository.findOne).toHaveBeenCalledTimes(1);
            expect(userRepository.findOne).toHaveBeenCalledWith({ id: 'user-id' });
        });

        it('should throw not found exception if user not found', async () => {
            userRepository.findOne.mockResolvedValueOnce(null);

            await expect(service.findOne('user-id')).rejects.toThrow('Usuário não encontrado.');
        });
    });

    describe('update', () => {
        it('should be defined', () => {
            expect(service.update).toBeDefined();
        });

        it('should call userRepository.udpate', async () => {
            const userStub = new UserStub();

            await service.update('user-id', userStub.requestDto);

            expect(userRepository.update).toHaveBeenCalledTimes(1);
            expect(userRepository.update).toHaveBeenCalledWith({ id: 'user-id' }, userStub.requestDto);
        });
    });

    describe('remove', () => {
        it('should be defined', () => {
            expect(service.remove).toBeDefined();
        });

        it('should call userRepository.remove', async () => {
            await service.remove('user-id');

            expect(userRepository.remove).toHaveBeenCalledTimes(1);
            expect(userRepository.remove).toHaveBeenCalledWith({ id: 'user-id' });
        });
    });
});
