const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
    console.log('Creating Admin User...');

    const hashedPassword = await bcrypt.hash('123123', 10);

    try {
        const user = await prisma.user.upsert({
            where: { email: 'admin@proterra.az' },
            update: {},
            create: {
                username: 'admin@proterra.az',
                email: 'admin@proterra.az',
                password: hashedPassword,
                name: 'Super Admin'
            }
        });
        console.log('Admin user ready:', user.email);
    } catch (e) {
        console.error('Error creating admin:', e);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
