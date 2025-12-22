const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding data...');

    // Clean up
    await prisma.productImage.deleteMany({});
    await prisma.productTranslation.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.categoryTranslation.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.user.deleteMany({}); // Clear existing users

    // Create Admin User
    const hashedPassword = await bcrypt.hash('123123', 10);
    await prisma.user.create({
        data: {
            username: 'proterra_admin',
            email: 'admin@proterra.az',
            password: hashedPassword,
            name: 'Super Admin'
        }
    });

    // Create Categories with Translations
    const categoriesData = [
        {
            img: '/images/categories/panels.jpg',
            en: 'Concrete Panels', ru: 'Панели из бетона', az: 'Beton Panellər', slug: 'concrete-panels',
            subs: [
                { en: 'Fiber Concrete Panels', ru: 'Панели из фибробетона', az: 'Fiber Beton Panellər', slug: 'fiber-panels' },
                { en: 'Relief Panels', ru: 'Рельефные панели', az: 'Relyefli Panellər', slug: 'relief-panels' },
                { en: 'Perforated Panels', ru: 'Перфорированные панели', az: 'Perforasiyalı Panellər', slug: 'perforated-panels' },
                { en: 'Curved Panels', ru: 'Изогнутые панели', az: 'Əyri Panellər', slug: 'curved-panels' }
            ]
        },
        {
            img: '/images/categories/planters.jpg',
            en: 'Concrete Planters', ru: 'Кашпо из бетона', az: 'Beton Dibçəklər', slug: 'concrete-planters'
        },
        {
            img: '/images/categories/benches.jpg',
            en: 'Concrete Benches', ru: 'Скамейки из бетона', az: 'Beton Oturacaqlar', slug: 'concrete-benches'
        },
        {
            img: '/images/categories/slabs.jpg',
            en: 'Large Format Concrete Slabs', ru: 'Крупноформатные плиты из бетона', az: 'İri Formatlı Beton Plitələr', slug: 'large-format-slabs'
        },
        {
            img: '/images/categories/sculptures.jpg',
            en: 'Landscape Concrete Sculptures', ru: 'Ландшафтные скульптуры из бетона', az: 'Landşaft Beton Heykəlləri', slug: 'landscape-sculptures'
        },
        {
            img: '/images/categories/bollards.jpg',
            en: 'Concrete Bollards', ru: 'Болларды из бетона', az: 'Beton Bollardlar', slug: 'bollards'
        },
        {
            img: '/images/categories/lights.jpg',
            en: 'Street Lights', ru: 'Уличные светильники', az: 'Küçə İşıqları', slug: 'street-lights'
        },
        {
            img: '/images/categories/firepits.jpg',
            en: 'Concrete Fire Pits', ru: 'Зоны кострища из бетона', az: 'Beton Ocaq Zonaları', slug: 'fire-pits'
        }
    ];

    for (const cat of categoriesData) {
        const category = await prisma.category.create({
            data: {
                imagePath: cat.img,
                translations: {
                    create: [
                        { locale: 'en', name: cat.en, slug: cat.slug },
                        { locale: 'ru', name: cat.ru, slug: cat.slug }, // russian slug same for simplicity or unique
                        { locale: 'az', name: cat.az, slug: cat.slug + '-az' },
                    ],
                },
            },
        });

        if (cat.subs) {
            for (const sub of cat.subs) {
                await prisma.category.create({
                    data: {
                        imagePath: cat.img, // placeholder
                        parentId: category.id,
                        translations: {
                            create: [
                                { locale: 'en', name: sub.en, slug: sub.slug },
                                { locale: 'ru', name: sub.ru, slug: sub.slug },
                                { locale: 'az', name: sub.az, slug: sub.slug + '-az' },
                            ]
                        }
                    }
                });
            }
        }

        // Create one sample product for each category (top level)
        await prisma.product.create({
            data: {
                categoryId: category.id,
                code: `CODE-${Math.floor(Math.random() * 1000)}`,
                dimensions: 'L1000 / B500 / H450 mm',
                weight: '120 kg',
                materialType: 'High-Performance Concrete',
                translations: {
                    create: [
                        { locale: 'en', title: `${cat.en} Sample`, description: `Premium ${cat.en.toLowerCase()} for modern spaces.` },
                        { locale: 'ru', title: `${cat.ru} Образец`, description: `Премиальный бетон для современных пространств.` },
                        { locale: 'az', title: `${cat.az} Nümunə`, description: `Müasir məkanlar üçün premium beton.` },
                    ],
                },
                images: {
                    create: [
                        { imagePath: 'https://placehold.co/600x600/e2e2e2/1a1a1a?text=Product', isMain: true },
                    ],
                },
            },
        });
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
