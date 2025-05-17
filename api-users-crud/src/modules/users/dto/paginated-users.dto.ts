import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponseDto } from '../../../common/dto/paginated-response.dto';
import { SerializedUserDto } from './serialized-user.dto';

export class PaginatedUsersDto extends PaginatedResponseDto {
    @ApiProperty()
    data: SerializedUserDto[];
}
