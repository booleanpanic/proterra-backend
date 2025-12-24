const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Checking Remote DB Content...');

    const catCount = await prisma.category.count();
    const prodCount = await prisma.product.count();
    const userCount = await prisma.user.count();

    console.log(`Counts: Users=${userCount}, Categories=${catCount}, Products=${prodCount}`);

    const categories = await prisma.category.findMany({
        include: { translations: true },
        take: 5
    });

    console.log('Sample Categories:');
    categories.forEach(c => {
        const enName = c.translations.find(t => t.locale === 'en')?.name || 'No Translation';
        console.log(`[${c.id}] ${enName} (Icon: ${c.icon})`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
