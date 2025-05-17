import { faker } from '@faker-js/faker';

export const objectWithMessage = (regex: RegExp) =>
    expect.objectContaining({
        message: expect.stringMatching(regex),
    });

export const sortById = (list: any[]) => list.sort((a, b) => (a.id > b.id ? 1 : -1));

export const numberMatching = (value: string) => expect.stringMatching(Number(value).toString());

interface RandomStringOptions {
    length?: number;
    casing?: 'upper' | 'lower';
}

export const getRandomString = (options?: RandomStringOptions) =>
    faker.string.alphanumeric({ length: 8, casing: 'upper' as const, ...options });
