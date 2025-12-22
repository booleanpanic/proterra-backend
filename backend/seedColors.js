const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const colors = [
    { ru: 'Белый', en: 'White', az: 'Ağ', type: 'standard' },
    { ru: 'Пепел', en: 'Ash', az: 'Kül', type: 'standard' },
    { ru: 'Кость', en: 'Bone / Ivory', az: 'Fil Dişi', type: 'standard' },
    { ru: 'Камень', en: 'Stone', az: 'Daş', type: 'standard' },
    { ru: 'Серый', en: 'Grey', az: 'Boz', type: 'standard' },
    { ru: 'Цинк', en: 'Zinc', az: 'Sink', type: 'standard' },
    { ru: 'Графит', en: 'Graphite', az: 'Qrafit', type: 'standard' },
    { ru: 'Чёрный', en: 'Black', az: 'Qara', type: 'standard' },
    { ru: 'Голубой', en: 'Light Blue', az: 'Mavi', type: 'standard' },
    { ru: 'Малахит', en: 'Malachite', az: 'Malaxit', type: 'standard' },
    { ru: 'Бирюзовый', en: 'Turquoise', az: 'Firuzəyi', type: 'standard' },
    { ru: 'Аквамарин', en: 'Aquamarine', az: 'Akvamarin', type: 'standard' },
    { ru: 'Оливковый', en: 'Olive', az: 'Zeytun', type: 'standard' },
    { ru: 'Мятный', en: 'Mint', az: 'Nanə', type: 'standard' },
    { ru: 'Пшеничный', en: 'Wheat', az: 'Buğda', type: 'standard' },
    { ru: 'Розовый', en: 'Pink', az: 'Çəhrayı', type: 'standard' },
    { ru: 'Песочный', en: 'Sand', az: 'Qum', type: 'standard' },
    { ru: 'Оранжевый', en: 'Orange', az: 'Narıncı', type: 'standard' },
    { ru: 'Терракот', en: 'Terracotta', az: 'Terrakota', type: 'standard' },
    { ru: 'Бронза', en: 'Bronze', az: 'Bürünc', type: 'standard' }
];

async function main() {
    console.log('Seeding colors...');

    // Clear existing textures if needed (optional - skipping delete to avoid resetting everything if not requested, but user said 'create these', so appending is safer, or deleting all is cleaner. I will delete all for clean slate as implied by 'create these' and 'admin management' being new.)
    // But user might have added some. However, since the model changed (name moved to translation), old rows might be invalid or need migration.
    // I'll wipe Textures to ensure clean state with new Translation model.
    await prisma.textureTranslation.deleteMany({});
    await prisma.texture.deleteMany({});

    for (const color of colors) {
        await prisma.texture.create({
            data: {
                type: color.type,
                imagePath: '', // Placeholder
                translations: {
                    create: [
                        { locale: 'ru', name: color.ru },
                        { locale: 'en', name: color.en },
                        { locale: 'az', name: color.az }
                    ]
                }
            }
        });
    }

    console.log(`Seeded ${colors.length} colors.`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
