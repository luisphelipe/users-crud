import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
    HasBadRequestResponse,
    HasCreatedResponse,
    HasNotFoundResponse,
    HasSuccessResponse,
} from '../../common/decorators/has-reponse.decorator';
import { HasPaginationQuery, Pagination, PaginationParams } from '../../common/decorators/pagination.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginatedUsersDto } from './dto/paginated-users.dto';
import { SerializedUserDto } from './dto/serialized-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @HasCreatedResponse({ type: SerializedUserDto })
    @HasBadRequestResponse()
    create(@Body() data: CreateUserDto) {
        return this.userService.create(data);
    }

    @Get()
    @HasSuccessResponse({ type: PaginatedUsersDto })
    @HasPaginationQuery()
    findAll(@Pagination() pagination: PaginationParams) {
        return this.userService.findAll(pagination);
    }

    @Get(':id')
    @HasSuccessResponse({ type: SerializedUserDto })
    @HasNotFoundResponse()
    findOne(@Param('id') id: string) {
        return this.userService.findOne(id);
    }

    // Comentarios mantidos para exemplificar a utilização da autenticação
    @Put(':id')
    // @UseGuards(JwtAuthGuard)
    // @HasBearerAuthentication()
    @HasSuccessResponse({ type: SerializedUserDto })
    @HasBadRequestResponse()
    @HasNotFoundResponse()
    update(
        @Param('id') id: string,
        @Body() data: UpdateUserDto,
        //  @User() user: SerializedUser
    ) {
        // if (user.id !== id) {
        //     throw new UnauthorizedException();
        // }

        return this.userService.update(id, data);
    }

    // Comentarios mantidos para exemplificar a utilização da autenticação
    @Delete(':id')
    // @UseGuards(JwtAuthGuard)
    // @HasBearerAuthentication()
    @HasSuccessResponse({ type: SerializedUserDto })
    @HasNotFoundResponse()
    remove(
        @Param('id') id: string,
        //  @User() user: SerializedUser
    ) {
        // Exemplo de utilização da autenticação
        // if (user.id !== id) {
        //     throw new UnauthorizedException();
        // }

        return this.userService.remove(id);
    }
}
