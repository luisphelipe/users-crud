import { NestFactory } from '@nestjs/core';
import { MainModule } from './main.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaExceptionFilter } from './common/prisma/prisma-exception.filter';
import { setup_swagger } from './config/setup-swagger';

async function bootstrap() {
    const app = await NestFactory.create(MainModule, { cors: true });

    // Only allow request fields declared in DTOs
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
        }),
    );

    app.useGlobalFilters(new PrismaExceptionFilter());

    setup_swagger(app);

    const CONFIG_SERVICE = app.get<ConfigService>(ConfigService);
    const PORT = CONFIG_SERVICE.get('PORT') as string;

    await app.listen(PORT);
}

void bootstrap();
