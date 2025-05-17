import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaSoftDeleteMiddlware } from './prisma-soft-delete.middleware';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        super();
        this.$use(PrismaSoftDeleteMiddlware);
    }

    async onModuleInit() {
        await this.$connect();
    }
}
