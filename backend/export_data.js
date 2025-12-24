const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
    console.log('Exporting data...');

    // Core Data
    const users = await prisma.user.findMany();
    const categories = await prisma.category.findMany({ include: { translations: true } });
    const products = await prisma.product.findMany({
        include: { translations: true, images: true }
    });

    // Content Data
    const textures = await prisma.texture.findMany({ include: { translations: true } });
    const heroSlides = await prisma.heroSlide.findMany({ include: { translations: true } });
    const projects = await prisma.project.findMany({ include: { translations: true, images: true } });

    const data = { categories, products, users, textures, heroSlides, projects };

    fs.writeFileSync('data_dump.json', JSON.stringify(data, null, 2));
    console.log(`Exported: ${categories.length} categories, ${products.length} products, ${users.length} users.`);
    console.log(`Exported content: ${textures.length} colors, ${heroSlides.length} slides, ${projects.length} projects.`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
