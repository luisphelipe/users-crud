import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import {
    HasBadRequestResponse,
    HasCreatedResponse,
    HasNotFoundResponse,
    HasSuccessResponse,
    HasUnauthorizedResponse,
} from '../../common/decorators/has-reponse.decorator';
import { User } from '../../common/decorators/user.decorator';
import { SerializedUser } from '../users/user.repository';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './services/auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    @HasCreatedResponse({ type: LoginResponseDto })
    @HasBadRequestResponse()
    async signup(@Body() data: CreateUserDto) {
        return this.authService.signup(data);
    }

    @Post('login')
    @UseGuards(LocalAuthGuard)
    @ApiBody({ type: LoginDto })
    @HasCreatedResponse({ type: LoginResponseDto })
    @HasNotFoundResponse()
    @HasUnauthorizedResponse({ description: 'when password is wrong' })
    async login(@User() user: SerializedUser) {
        return this.authService.login(user.id);
    }

    @Post('forgot-password')
    @HasCreatedResponse()
    @HasNotFoundResponse()
    async forgotPassword(@Body() payload: ForgotPasswordDto) {
        return this.authService.forgotPassword(payload.email);
    }

    @Post('reset-password')
    @HasCreatedResponse()
    @HasUnauthorizedResponse()
    @HasBadRequestResponse()
    @HasNotFoundResponse()
    async resetPassword(@Body() payload: ResetPasswordDto) {
        return this.authService.resetPassword(payload);
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HasSuccessResponse({ type: ProfileResponseDto })
    @HasUnauthorizedResponse()
    async profile(@User() user: SerializedUser) {
        return this.authService.profile(user.id);
    }
}
