export const paginatedMock = (data: any) => ({
    meta: expect.objectContaining({
        total: expect.any(Number),
        lastPage: expect.any(Number),
        currentPage: expect.any(Number),
        perPage: expect.any(Number),
        // prev: null,
        // next: null,
    }),
    data,
});
