import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PaginateOptions, createPaginator } from 'prisma-pagination';
import { BcryptService } from '../../common/bcrypt/services/bcrypt.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { serialize } from '../../common/utils/serialize.utils';

export type SerializedUser = {
    id: string;
    email: string;
    name: string | null;
};

export const SHALLOW_USER_FIELDS_SELECT = {
    id: true,
    name: true,
    email: true,
};

export const USER_FIELDS_SELECT = {
    ...SHALLOW_USER_FIELDS_SELECT,
};

export const SERIALIZED_USER_KEYS = Object.keys(USER_FIELDS_SELECT);

@Injectable()
export class UserRepository {
    constructor(
        private prisma: PrismaService,
        private bcryptService: BcryptService,
    ) {}

    hashPassword(password: string) {
        return this.bcryptService.hashSync(password, 10);
    }

    serializeUser(user: User): SerializedUser {
        return serialize<SerializedUser>(user, SERIALIZED_USER_KEYS);
    }

    create(data: Prisma.UserCreateInput): Promise<SerializedUser> {
        const payload = { ...data, password: this.hashPassword(data.password) };
        return this.prisma.user.create({ data: payload, select: USER_FIELDS_SELECT });
    }

    findAll(where?: Prisma.UserWhereInput): Promise<SerializedUser[]> {
        return this.prisma.user.findMany({ where, select: USER_FIELDS_SELECT });
    }

    async paginate(args: Prisma.UserFindManyArgs, pagination: PaginateOptions) {
        const paginate = createPaginator(pagination);

        return paginate<User, Prisma.UserFindManyArgs>(this.prisma.user, {
            ...args,
            select: USER_FIELDS_SELECT,
            orderBy: { updated_at: 'desc' },
        });
    }

    findOne(where: Prisma.UserWhereInput): Promise<SerializedUser | null> {
        return this.prisma.user.findFirst({
            where,
            select: USER_FIELDS_SELECT,
        });
    }

    findOneWithPassword(where: Prisma.UserWhereInput): Promise<User | null> {
        return this.prisma.user.findFirst({ where });
    }

    async update(where: Prisma.UserWhereUniqueInput, data: Prisma.UserUpdateInput): Promise<SerializedUser> {
        const payload = { ...data };

        if (payload.password) {
            payload.password = this.hashPassword(data.password as string);
        }

        return await this.prisma.user.update({ where, data: payload, select: USER_FIELDS_SELECT });
    }

    remove(where: Prisma.UserWhereUniqueInput): Promise<SerializedUser> {
        return this.prisma.user.delete({ where, select: USER_FIELDS_SELECT });
    }
}
