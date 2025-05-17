import { Test, TestingModule } from '@nestjs/testing';
import { BcryptService } from '../services/bcrypt.service';

describe('BcryptService', () => {
    let bcryptService: BcryptService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [BcryptService],
        }).compile();

        bcryptService = module.get<BcryptService>(BcryptService);
    });

    it('should be defined', () => {
        expect(bcryptService).toBeDefined();
    });
});
