import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ValidationErrorResponseDto {
    @ApiProperty()
    statusCode = 400;

    @ApiProperty()
    message = ['{field} must be a {field_type}'];

    @ApiPropertyOptional()
    error = 'Bad Request';
}
