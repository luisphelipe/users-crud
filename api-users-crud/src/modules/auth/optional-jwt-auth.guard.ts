import { Injectable } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class OptionalJwtAuthGuard extends JwtAuthGuard {
    // Override handleRequest so it never throws an error
    handleRequest(_, user) {
        return user;
    }
}
