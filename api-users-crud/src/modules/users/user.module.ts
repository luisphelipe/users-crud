import { forwardRef, Module } from '@nestjs/common';
import { BcryptModule } from '../../common/bcrypt/bcrypt.module';
import { BcryptService } from '../../common/bcrypt/services/bcrypt.service';
import { AuthModule } from '../auth/auth.module';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
    imports: [BcryptModule, forwardRef(() => AuthModule)],
    controllers: [UserController],
    providers: [UserRepository, BcryptService, UserService],
    exports: [UserRepository, UserService],
})
export class UserModule {}
