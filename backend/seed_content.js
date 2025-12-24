const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding Content (Categories & Products)...');

    // Categories Data
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
        // Check if category exists to avoid duplicates
        const existing = await prisma.categoryTranslation.findFirst({
            where: { slug: cat.slug }
        });

        if (existing) {
            console.log(`Skipping ${cat.en} (already exists)`);
            continue;
        }

        console.log(`Creating ${cat.en}...`);

        const category = await prisma.category.create({
            data: {
                imagePath: cat.img,
                translations: {
                    create: [
                        { locale: 'en', name: cat.en, slug: cat.slug },
                        { locale: 'ru', name: cat.ru, slug: cat.slug },
                        { locale: 'az', name: cat.az, slug: cat.slug + '-az' },
                    ],
                },
            },
        });

        if (cat.subs) {
            for (const sub of cat.subs) {
                await prisma.category.create({
                    data: {
                        imagePath: cat.img,
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

        // Create Demo Product
        await prisma.product.create({
            data: {
                categoryId: category.id,
                code: `DEMO-${Math.floor(Math.random() * 1000)}`,
                dimensions: '100x100 cm',
                weight: '50 kg',
                materialType: 'Concrete',
                translations: {
                    create: [
                        { locale: 'en', title: `${cat.en} Demo`, description: `Premium ${cat.en} description.` },
                        { locale: 'ru', title: `${cat.ru} Демо`, description: `Описание для ${cat.ru}.` },
                        { locale: 'az', title: `${cat.az} Nümunə`, description: `${cat.az} üçün təsvir.` },
                    ],
                },
                images: {
                    create: [
                        { imagePath: 'https://placehold.co/600x600/e2e2e2/1a1a1a?text=ProTerra', isMain: true },
                    ],
                },
            },
        });
    }

    console.log('Seeding finished!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
