const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Fetching categories...');
    const allCategories = await prisma.category.findMany({
        include: { translations: true, children: { include: { translations: true } } }
    });

    // Flatten logic
    let targets = [];
    for (const cat of allCategories) {
        targets.push(cat);
        if (cat.children && cat.children.length > 0) {
            targets.push(...cat.children);
        }
    }

    console.log(`Found ${targets.length} categories/subcategories.`);

    for (const cat of targets) {
        // Check if product exists
        const count = await prisma.product.count({ where: { categoryId: cat.id } });
        if (count === 0) {
            const catName = cat.translations.find(t => t.locale === 'az')?.name || 'Category';
            console.log(`Creating test product for: ${catName} (ID: ${cat.id})`);

            await prisma.product.create({
                data: {
                    categoryId: cat.id,
                    code: `TEST-${cat.id}`,
                    dimensions: '100x100',
                    weight: '10kg',
                    materialType: 'Concrete',
                    price: '150 AZN',
                    translations: {
                        create: [
                            { locale: 'az', title: `Test Məhsul - ${catName}`, description: 'Bu bir test məhsuludur.' },
                            { locale: 'en', title: `Test Product - ${catName}`, description: 'This is a test product.' },
                            { locale: 'ru', title: `Тестовый продукт - ${catName}`, description: 'Это тестовый продукт.' }
                        ]
                    },
                    images: {
                        create: [
                            { imagePath: '/uploads/placeholder.jpg', isMain: true, sortOrder: 0 }
                        ]
                    }
                }
            });
        }
    }
    console.log('Seeding complete.');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
