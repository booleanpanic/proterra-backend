const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const count = await prisma.texture.count();
    console.log(`Texture count: ${count}`);
    const first = await prisma.texture.findFirst({ include: { translations: true } });
    console.log('First texture:', JSON.stringify(first, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
