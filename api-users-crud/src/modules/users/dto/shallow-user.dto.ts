import { ApiProperty } from '@nestjs/swagger';

export class ShallowUserDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    name: string;
}
