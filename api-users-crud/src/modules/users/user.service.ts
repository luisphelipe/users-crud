import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PaginationParams } from '../../common/decorators/pagination.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly userRepository: UserRepository,
    ) {}

    async create(data: CreateUserDto) {
        const payload = { ...data, email: data.email.toLowerCase() };

        await this.invalidateCache();

        return this.userRepository.create(payload);
    }

    async findAll(pagination: PaginationParams) {
        // get from cache (if present)
        const cacheKey = `users:all:${pagination.perPage}:${pagination.page}`;
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) return cached;

        const users = await this.userRepository.paginate({}, pagination);

        // save to cache
        await this.cacheManager.set(cacheKey, users);
        const keys = ((await this.cacheManager.get('users:all')) as string[]) || [];
        await this.cacheManager.set('users:all', [...keys, cacheKey]);

        return users;
    }

    async findOne(id: string) {
        // get from cache (if present)
        const cacheKey = `users:${id}`;
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) return cached;

        const user = await this.userRepository.findOne({ id });

        if (!user) {
            throw new NotFoundException('Usuário não encontrado.');
        }

        // save to cache
        await this.cacheManager.set(cacheKey, user);

        return user;
    }

    async update(id: string, data: UpdateUserDto) {
        const user = await this.userRepository.update({ id }, data);

        await this.invalidateCache(id);

        return user;
    }

    async remove(id: string) {
        const user = this.userRepository.remove({ id });

        await this.invalidateCache(id);

        return user;
    }

    async invalidateCache(id?: string) {
        const keys = ((await this.cacheManager.get('users:all')) as string[]) || [];

        for (const key of keys) {
            await this.cacheManager.del(key);
        }

        if (id) {
            await this.cacheManager.del(`users:${id}`);
        }
    }
}
