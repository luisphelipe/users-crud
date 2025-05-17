import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { faker } from '@faker-js/faker';

async function main() {
    await seedDevelopment();
    await seedProduction();
}

const seedProduction = async () => {
    if (process.env.NODE_ENV !== 'production') return;
};

const seedDevelopment = async () => {
    if (process.env.NODE_ENV !== 'development') return;

    const users = await prisma.user.findMany();

    if (users.length === 0) {
        const mockUsers = new Array(200).fill(0).map(createUser);
        await prisma.user.createMany({ data: mockUsers });
    }
};

const createUser = (data: any = {}): Prisma.UserCreateInput => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: 'seeded-data',
    ...data,
});

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
