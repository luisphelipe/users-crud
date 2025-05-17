import { ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MainModule } from '../src/main.module';
import { PrismaExceptionFilter } from '../src/common/prisma/prisma-exception.filter';
import { AuthService } from '../src/modules/auth/services/auth.service';
import { UserStub } from '../src/modules/users/stubs/user.stub';
import { PrismaService } from '../src/common/prisma/prisma.service';

export const setupApp = async () => {
    const moduleRef = await Test.createTestingModule({
        imports: [MainModule],
    }).compile();

    const app = moduleRef.createNestApplication();

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
        }),
    );

    app.useGlobalFilters(new PrismaExceptionFilter());

    await app.init();

    const httpService = app.getHttpServer();

    return { moduleRef, _app: app, _httpService: httpService };
};

export const createAccessToken = (authService: AuthService, user: UserStub = new UserStub()) => {
    return `Bearer ${authService.buildAccessToken(user.serialized)}`;
};

export const deleteAllUsers = async (prismaService: PrismaService) => {
    await prismaService.$queryRaw`DELETE FROM "User"`;
};

// EOF - crud generator reference comment
