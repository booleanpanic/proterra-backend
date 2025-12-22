const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const count = await prisma.heroSlide.count();
        console.log(`HeroSlide count: ${count}`);
    } catch (e) {
        console.error('Error accessing HeroSlide:', e.message);
        process.exit(1);
    }
}

main().finally(async () => await prisma.$disconnect());
