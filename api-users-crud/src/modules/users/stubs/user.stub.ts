import { faker } from '@faker-js/faker';
import { createId } from '@paralleldrive/cuid2';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { serialize } from '../../../common/utils/serialize.utils';
import { SERIALIZED_USER_KEYS, SerializedUser, UserRepository } from '../user.repository';

export const userSecretStub = (password = passwordStub()) => `${jwtSecretKeyStub()}_${password}`;

export const accessTokenStub = () => `encrypted_data`;

export const passwordStub = (char = '') => `pass_${char}`;

export const passwordHashStub = (password = '') => `${password}Hash`;

export const jwtSecretKeyStub = () => 'really-secret-hash';

export class UserStub {
    id: string;
    email: string;
    name: string;
    password: string;
    created_at: Date;
    updated_at: Date;

    constructor(data?: Partial<UserStub>) {
        this.id = createId();
        this.email = faker.internet.email().toLowerCase();
        this.name = faker.person.firstName();
        this.created_at = new Date();
        this.updated_at = new Date();
        Object.assign(this, data);
        this.password = data?.password || faker.string.sample();
    }

    get requestDto() {
        return {
            name: this.name,
            email: this.email,
            password: this.password,
        };
    }

    get query() {
        return Object.fromEntries(Object.entries(this));
    }

    get shallow() {
        return {
            email: this.email,
            id: this.id,
            name: this.name,
        };
    }

    get serialized(): SerializedUser {
        return { ...serialize<SerializedUser>(this, SERIALIZED_USER_KEYS) };
    }

    get matching() {
        const payload = {
            ...this.serialized,
            id: expect.any(String),
        };

        return payload;
    }

    async save(prismaService: PrismaService, userRepository?: UserRepository) {
        const passwordHash = userRepository ? userRepository.hashPassword(this.password) : this.password + 'Hash';

        // await this.save_relations(prismaService);

        const user = await prismaService.user.create({
            data: { ...this.query, password: passwordHash },
            select: { id: true },
        });

        this.id = user.id;

        return this.serialized;
    }

    // async save_relations(prismaService: PrismaService) {}
}
