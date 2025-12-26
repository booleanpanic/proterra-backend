const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
    const newPassword = 'Ilgar340!';
    const username = 'proterra_admin';

    console.log(`Updating password for user: ${username}...`);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    try {
        const user = await prisma.user.update({
            where: { username: username },
            data: { password: hashedPassword },
        });
        console.log(`Success! Password for ${user.username} has been changed.`);
    } catch (error) {
        if (error.code === 'P2025') {
            console.error(`Error: User '${username}' not found.`);
        } else {
            console.error('Error updating password:', error);
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
