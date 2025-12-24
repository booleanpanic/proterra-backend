const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
    console.log('Importing data...');
    const raw = fs.readFileSync('data_dump.json', 'utf8');
    const data = JSON.parse(raw);

    // Import Users
    for (const u of data.users) {
        await prisma.user.upsert({
            where: { email: u.email },
            update: {},
            create: {
                username: u.username,
                email: u.email,
                password: u.password,
                name: u.name || 'Admin'
            }
        });
    }

    // Import Categories
    for (const cat of data.categories) {
        try {
            // Check if exists
            const existing = await prisma.category.findUnique({ where: { id: cat.id } });
            if (!existing) {
                await prisma.category.create({
                    data: {
                        id: cat.id, // Keep same ID
                        imagePath: cat.imagePath,
                        icon: cat.icon,
                        parentId: cat.parentId,
                        translations: {
                            create: cat.translations.map(t => ({
                                locale: t.locale,
                                name: t.name,
                                slug: t.slug,
                                description: t.description
                            }))
                        }
                    }
                });
            }
        } catch (e) { console.error('Error importing category:', e.message); }
    }

    // Import Products
    for (const p of data.products) {
        try {
            await prisma.product.create({
                data: {
                    categoryId: p.categoryId,
                    code: p.code,
                    dimensions: p.dimensions,
                    weight: p.weight,
                    materialType: p.materialType,
                    price: p.price,
                    translations: {
                        create: p.translations.map(t => ({
                            locale: t.locale,
                            title: t.title,
                            description: t.description
                        }))
                    },
                    images: {
                        create: p.images.map(img => ({
                            imagePath: img.imagePath,
                            isMain: img.isMain,
                            sortOrder: img.sortOrder
                        }))
                    }
                }
            });
        } catch (e) { console.error('Skipping duplicate/error product:', p.code); }
    }

    // Import Textures (Colors)
    if (data.textures) {
        for (const t of data.textures) {
            try {
                await prisma.texture.create({
                    data: {
                        imagePath: t.imagePath,
                        type: t.type,
                        sortOrder: t.sortOrder,
                        translations: {
                            create: t.translations.map(tr => ({
                                locale: tr.locale,
                                name: tr.name
                            }))
                        }
                    }
                });
            } catch (e) { console.error('Error importing texture:', e.message); }
        }
    }

    // Import Hero Slides
    if (data.heroSlides) {
        for (const s of data.heroSlides) {
            try {
                await prisma.heroSlide.create({
                    data: {
                        imagePath: s.imagePath,
                        sortOrder: s.sortOrder,
                        translations: {
                            create: s.translations.map(tr => ({
                                locale: tr.locale,
                                title: tr.title,
                                subtitle: tr.subtitle
                            }))
                        }
                    }
                });
            } catch (e) { console.error('Error importing slide:', e.message); }
        }
    }

    // Import Projects
    if (data.projects) {
        for (const p of data.projects) {
            try {
                await prisma.project.create({
                    data: {
                        translations: {
                            create: p.translations.map(tr => ({
                                locale: tr.locale,
                                title: tr.title,
                                description: tr.description
                            }))
                        },
                        images: {
                            create: p.images.map(img => ({
                                imagePath: img.imagePath,
                                isMain: img.isMain,
                                sortOrder: img.sortOrder
                            }))
                        }
                    }
                });
            } catch (e) { console.error('Error importing project:', e.message); }
        }
    }

    console.log('Import finished.');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
