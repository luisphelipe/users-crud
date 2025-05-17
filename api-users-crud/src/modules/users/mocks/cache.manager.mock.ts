export const cacheManagerMock = () => ({
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn(),
    del: jest.fn(),
});
