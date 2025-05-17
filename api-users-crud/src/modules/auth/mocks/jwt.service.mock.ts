import { accessTokenStub } from '../../users/stubs/user.stub';

export const jwtServiceMock = () => ({
    sign: jest.fn().mockReturnValue(accessTokenStub()),
    verifyAsync: jest.fn().mockResolvedValue(true),
});
