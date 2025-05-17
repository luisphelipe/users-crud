import { ApiProperty } from '@nestjs/swagger';
import { SerializedUserDto } from '../../users/dto/serialized-user.dto';

export class ProfileResponseDto {
    @ApiProperty()
    user: SerializedUserDto;
}
