import { ApiProperty } from '@nestjs/swagger';
import { ProfileResponseDto } from './profile-response.dto';

export class LoginResponseDto extends ProfileResponseDto {
    @ApiProperty()
    access_token: string;
}
