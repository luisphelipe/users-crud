jest.mock('../../../common/utils/serialize.utils', () => ({
    serialize: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { bcryptServiceMock } from '../../../common/bcrypt/mocks/bcrypt.service.mock';
import { BcryptService } from '../../../common/bcrypt/services/bcrypt.service';
import { prismaServiceMock } from '../../../common/prisma/mocks/prisma.service.mock';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { UserStub } from '../stubs/user.stub';
import { UserRepository } from '../user.repository';
import { serialize } from '../../../common/utils/serialize.utils';

describe('UserRepository', () => {
    let repository: UserRepository;
    const prismaService = prismaServiceMock(),
        bcryptService = bcryptServiceMock();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserRepository,
                { provide: PrismaService, useValue: prismaService },
                { provide: BcryptService, useValue: bcryptService },
            ],
        }).compile();

        repository = module.get<UserRepository>(UserRepository);
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });

    // hashPassword(password: string) {
    describe('hashPassword', () => {
        it('calls bcryptService.hashSync', () => {
            repository.hashPassword('example');

            expect(bcryptService.hashSync).toHaveBeenCalledTimes(1);
            expect(bcryptService.hashSync).toHaveBeenCalledWith('example', 10);
        });
    });

    // serializeUser(user: User): SerializedUser {
    describe('serializeUser', () => {
        it('calls serialize with user fields', async () => {
            const user = new UserStub();

            repository.serializeUser(user);

            expect(serialize).toHaveBeenCalledTimes(1);
            expect(serialize).toHaveBeenCalledWith(user, ['id', 'name', 'email']);
        });
    });

    // create(data: Prisma.UserCreateInput): Promise<SerializedUser> {
    describe('create', () => {
        it('calls hashPassword', async () => {
            repository.hashPassword = jest.fn();
            prismaService.user.create.mockClear();
            const user = new UserStub();

            await repository.create(user.requestDto);

            expect(repository.hashPassword).toHaveBeenCalledTimes(1);
            expect(repository.hashPassword).toHaveBeenCalledWith(user.password);
        });

        it('calls prisma.user.create with hashed password', async () => {
            repository.hashPassword = jest.fn().mockReturnValueOnce('hashed-password');
            prismaService.user.create.mockClear();
            const user = new UserStub();

            await repository.create(user.requestDto);

            expect(prismaService.user.create).toHaveBeenCalledTimes(1);
            expect(prismaService.user.create).toHaveBeenCalledWith({
                data: { ...user.requestDto, password: 'hashed-password' },
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            });
        });
    });

    // findAll(where?: Prisma.UserWhereInput): Promise<SerializedUser[]> {
    describe('findAll', () => {
        it('calls prisma.user.findMany', async () => {
            await repository.findAll();

            expect(prismaService.user.findMany).toHaveBeenCalledTimes(1);
            expect(prismaService.user.findMany).toHaveBeenCalledWith({ select: { id: true, name: true, email: true } });
        });
    });

    // async paginate(args: Prisma.UserFindManyArgs, pagination: PaginateOptions) {
    describe('paginate', () => {
        it('returns a paginated result object', async () => {
            const user = new UserStub().serialized;
            prismaService.user.findMany.mockClear();
            prismaService.user.findMany.mockResolvedValueOnce([user]);
            prismaService.user.count.mockResolvedValueOnce(1);

            const result = await repository.paginate({}, { page: 1, perPage: 10 });

            expect(prismaService.user.findMany).toHaveBeenCalledTimes(1);
            expect(prismaService.user.findMany).toHaveBeenCalledWith(expect.objectContaining({ skip: 0, take: 10 }));
            expect(result).toEqual({
                meta: {
                    total: 1,
                    lastPage: 1,
                    currentPage: 1,
                    perPage: 10,
                    prev: null,
                    next: null,
                },
                data: [user],
            });
        });
    });

    // findOne(where: Prisma.UserWhereInput): Promise<SerializedUser | null> {
    describe('findOne', () => {
        it('calls prisma.user.findFirst', async () => {
            prismaService.user.findFirst.mockClear();

            await repository.findOne({ id: '1' });

            expect(prismaService.user.findFirst).toHaveBeenCalledTimes(1);
            expect(prismaService.user.findFirst).toHaveBeenCalledWith({
                where: { id: '1' },
                select: { id: true, name: true, email: true },
            });
        });
    });

    // findOneWithPassword(where: Prisma.UserWhereInput): Promise<User | null> {
    describe('findOneWithPassword', () => {
        it('calls prisma.user.findFirst', async () => {
            prismaService.user.findFirst.mockClear();

            await repository.findOneWithPassword({ id: '1' });

            expect(prismaService.user.findFirst).toHaveBeenCalledTimes(1);
            expect(prismaService.user.findFirst).toHaveBeenCalledWith({
                where: { id: '1' },
            });
        });
    });

    // async update(where: Prisma.UserWhereUniqueInput, data: Prisma.UserUpdateInput): Promise<SerializedUser> {
    describe('update', () => {
        it('calls hashPassword', async () => {
            repository.hashPassword = jest.fn();
            prismaService.user.update.mockClear();
            const user = new UserStub();

            await repository.update({ id: '1' }, user.requestDto);

            expect(repository.hashPassword).toHaveBeenCalledTimes(1);
            expect(repository.hashPassword).toHaveBeenCalledWith(user.password);
        });

        it('calls prisma.user.create with hashed password', async () => {
            repository.hashPassword = jest.fn().mockReturnValueOnce('hashed-password');
            prismaService.user.update.mockClear();
            const user = new UserStub();

            await repository.update({ id: '1' }, user.requestDto);

            expect(prismaService.user.update).toHaveBeenCalledTimes(1);
            expect(prismaService.user.update).toHaveBeenCalledWith({
                where: { id: '1' },
                data: { ...user.requestDto, password: 'hashed-password' },
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            });
        });
    });

    // remove(where: Prisma.UserWhereUniqueInput): Promise<SerializedUser> {
    describe('remove', () => {
        it('calls prisma.user.delete', async () => {
            await repository.remove({ id: '1' });

            expect(prismaService.user.delete).toHaveBeenCalledTimes(1);
            expect(prismaService.user.delete).toHaveBeenCalledWith({
                where: { id: '1' },
                select: { id: true, name: true, email: true },
            });
        });
    });
});
