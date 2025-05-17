import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from './pagination-meta.dto';

export class PaginatedResponseDto {
    @ApiProperty()
    meta: PaginationMetaDto;
}
