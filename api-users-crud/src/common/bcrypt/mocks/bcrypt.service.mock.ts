export const bcryptServiceMock = () => ({
    hashSync: jest.fn().mockReturnValue(true),
    compareSync: jest.fn().mockReturnValue(true),
});
