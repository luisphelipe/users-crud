import { User } from '@prisma/client';
import { serialize } from '../../../common/utils/serialize.utils';
import { UserStub } from '../stubs/user.stub';
import { SERIALIZED_USER_KEYS } from '../user.repository';

export const userRepositoryMock = () => ({
    findAll: jest.fn().mockResolvedValue([new UserStub().serialized]),
    paginate: jest.fn().mockResolvedValue({ meta: {}, data: [new UserStub().serialized] }),
    findOne: jest.fn().mockResolvedValue(new UserStub().serialized),
    findOneWithPassword: jest.fn().mockResolvedValue(new UserStub().query),
    create: jest.fn().mockResolvedValue(new UserStub().serialized),
    update: jest.fn().mockResolvedValue(new UserStub().serialized),
    remove: jest.fn().mockResolvedValue(new UserStub().serialized),
    hashPassword: jest.fn().mockImplementation((pass: string) => `${pass}Hash`),
    serializeUser: jest.fn().mockImplementation((user: User) => serialize(user, SERIALIZED_USER_KEYS)),
});
