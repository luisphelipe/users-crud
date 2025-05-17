import { Injectable } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class BcryptService {
    compareSync(password: string, passwordHash: string) {
        return bcryptjs.compareSync(password, passwordHash);
    }

    hashSync(password: string, salt: number) {
        return bcryptjs.hashSync(password, salt);
    }
}
