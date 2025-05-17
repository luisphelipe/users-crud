import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppModule } from './modules/app/app.module';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
// END OF FILE IMPORTS

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env.${process.env.NODE_ENV}`,
        }),
        CacheModule.registerAsync({
            useFactory: async () => ({
                store: redisStore,
                host: 'localhost',
                port: 6390,
                ttl: 60 * 1000, // default TTL in ms
            }),
            isGlobal: true,
        }),
        PrismaModule,
        AppModule,
        UserModule,
        AuthModule,
        // END OF IMPORTS ARRAY
    ],
    controllers: [],
    providers: [],
})
export class MainModule {}
