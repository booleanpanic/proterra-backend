const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getCategories = async (req, res) => {
    const { lang = 'az' } = req.query; // default language

    try {
        const categories = await prisma.category.findMany({
            where: { parentId: null },
            include: {
                translations: {
                    where: { locale: lang },
                },
                children: {
                    include: {
                        translations: {
                            where: { locale: lang },
                        },
                    },
                },
            },
            orderBy: { id: 'asc' },
        });

        const formatted = categories.map((cat) => {
            const translation = cat.translations[0] || {};
            return {
                id: cat.id,
                imagePath: cat.imagePath,
                name: translation.name || 'No Translation',
                slug: translation.slug || '',
                children: cat.children.map(sub => {
                    const subTrans = sub.translations[0] || {};
                    return {
                        id: sub.id,
                        name: subTrans.name || 'No Trans',
                        slug: subTrans.slug || '',
                        image: sub.imagePath
                    };
                })
            };
        });

        res.json(formatted);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
};

const createCategory = async (req, res) => {
    const { imagePath, translations, icon, parentId } = req.body;
    // translations expected as [{ locale: 'az', name: '...', slug: '...' }, ...]

    try {
        const category = await prisma.category.create({
            data: {
                imagePath,
                icon: icon || 'Box',
                parentId: parentId ? parseInt(parentId) : null,
                translations: {
                    create: translations,
                },
            },
            include: {
                translations: true,
            },
        });
        res.status(201).json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create category' });
    }
};

module.exports = {
    getCategories,
    createCategory,
    getAdminCategories: async (req, res) => {
        try {
            const categories = await prisma.category.findMany({
                include: {
                    translations: true,
                    children: { include: { translations: true } }
                },
                orderBy: { id: 'asc' }
            });
            res.json(categories);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch categories' });
        }
    },
    updateCategory: async (req, res) => {
        const { id } = req.params;
        const { imagePath, translations, parentId, icon } = req.body;

        try {
            // Update main fields
            const category = await prisma.category.update({
                where: { id: parseInt(id) },
                data: {
                    imagePath,
                    icon,
                    parentId: parentId || null
                }
            });

            // Update translations
            if (translations && translations.length > 0) {
                await prisma.categoryTranslation.deleteMany({
                    where: { categoryId: parseInt(id) }
                });

                await prisma.categoryTranslation.createMany({
                    data: translations.map(t => ({
                        categoryId: parseInt(id),
                        locale: t.locale,
                        name: t.name,
                        slug: t.slug
                    }))
                });
            }

            res.json(category);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to update category' });
        }
    },
    deleteCategory: async (req, res) => {
        const { id } = req.params;
        const categoryId = parseInt(id);

        try {
            await prisma.$transaction(async (prisma) => {
                // 1. Identify all categories to be deleted (parent + children)
                const children = await prisma.category.findMany({ where: { parentId: categoryId }, select: { id: true } });
                const allCategoryIds = [categoryId, ...children.map(c => c.id)];

                // 2. Find all products in these categories
                const products = await prisma.product.findMany({ where: { categoryId: { in: allCategoryIds } }, select: { id: true } });
                const productIds = products.map(p => p.id);

                if (productIds.length > 0) {
                    // 3. Delete Product Dependencies
                    await prisma.productImage.deleteMany({ where: { productId: { in: productIds } } });
                    await prisma.productTranslation.deleteMany({ where: { productId: { in: productIds } } });

                    // 4. Delete Products
                    await prisma.product.deleteMany({ where: { id: { in: productIds } } });
                }

                // 5. Delete Category Dependencies (Translations)
                await prisma.categoryTranslation.deleteMany({ where: { categoryId: { in: allCategoryIds } } });

                // 6. Delete Children Categories
                if (children.length > 0) {
                    await prisma.category.deleteMany({ where: { parentId: categoryId } });
                }

                // 7. Delete Parent Category
                await prisma.category.delete({
                    where: { id: categoryId }
                });
            });

            res.json({ message: 'Category deleted' });
        } catch (error) {
            console.error('Delete failed:', error);
            res.status(500).json({ error: 'Failed to delete category' });
        }
    }
};
