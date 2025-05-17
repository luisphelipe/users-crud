import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import { BcryptService } from '../../../common/bcrypt/services/bcrypt.service';
import { SendEmailService } from '../../../common/mailer/services/send-email.service';
import { SerializedUser, UserRepository } from '../../users/user.repository';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { UserService } from '../../users/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
        private readonly sendEmailService: SendEmailService,
        private readonly bcryptService: BcryptService,
        private readonly configService: ConfigService,
        private readonly userService: UserService,
    ) {}

    async signup(data: CreateUserDto) {
        const user = await this.userService.create(data);

        return this.login(user.id);
    }

    verifyIfUserExists(user: User | null) {
        if (!user) {
            throw new NotFoundException('Usuário não encontrado.');
        }
    }

    verifyUserPassword(pass: string, hashPassword: string) {
        const correctPassword = this.bcryptService.compareSync(pass, hashPassword);

        if (!correctPassword) {
            throw new UnauthorizedException('Senha incorreta.');
        }
    }

    async findUser(where: Prisma.UserWhereInput) {
        const user = await this.userRepository.findOneWithPassword(where);

        this.verifyIfUserExists(user);

        return user as User;
    }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.findUser({ email: { equals: email, mode: 'insensitive' } });

        this.verifyUserPassword(password, user?.password);

        const serialized = this.userRepository.serializeUser(user);

        return serialized;
    }

    buildAccessToken(user: SerializedUser, options?: JwtSignOptions) {
        const access_token = this.jwtService.sign(user, options);

        return access_token;
    }

    async login(id: string) {
        const profile = await this.profile(id);

        const access_token = this.buildAccessToken(profile.user);

        return {
            ...profile,
            access_token,
        };
    }

    async profile(id: string) {
        const user = await this.userRepository.findOne({ id });

        return {
            user: user as SerializedUser,
        };
    }

    buildUserCustomSecret(user: Pick<User, 'password'>) {
        const JWT_SECRET = this.configService.get('JWT_SECRET_KEY');
        return `${JWT_SECRET}_${user.password}`;
    }

    async sendPasswordResetEmail({ id, email, access_token }: SendPasswordEmailPayload) {
        const host = this.configService.get('FRONTEND_APP_URL');
        const link = `${host}/auth/reset-password?id=${id}&access-token=${access_token}`;
        const text = `Acesse o link para redefinir sua senha:\n\n${link}`;

        const payload = {
            to: email,
            subject: 'Redefinição de senha',
            text,
        };

        await this.sendEmailService.commit(payload);
    }

    async forgotPassword(email: string) {
        const user = await this.findUser({ email: { equals: email, mode: 'insensitive' } });

        // hack for creating one-time use jwt token
        const custom_secret = this.buildUserCustomSecret(user);

        const serialized_user = this.userRepository.serializeUser(user);

        const access_token = this.buildAccessToken(serialized_user, {
            secret: custom_secret,
        });

        const resetPasswordEmailPayload = {
            id: user.id,
            email: user.email,
            access_token,
        };

        await this.sendPasswordResetEmail(resetPasswordEmailPayload);

        return {
            message: 'successfully sent password reset link to user email',
        };
    }

    async resetPassword({ id, password, access_token }: ResetPasswordDto) {
        const user = await this.findUser({ id });

        const custom_secret = this.buildUserCustomSecret(user);

        try {
            await this.jwtService.verifyAsync(access_token, {
                secret: custom_secret,
            });

            await this.userRepository.update({ id }, { password });

            // return { message: 'successfully updated the user password' };
            return this.login(id);
        } catch (err) {
            throw new UnauthorizedException(err.message);
        }
    }
}

interface SendPasswordEmailPayload {
    id: string;
    email: string;
    access_token: string;
}
