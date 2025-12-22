const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ProductController {
    // Get all products (admin view)
    async getAdminProducts(req, res) {
        try {
            const products = await prisma.product.findMany({
                include: {
                    category: {
                        include: {
                            translations: true
                        }
                    },
                    translations: true,
                    images: {
                        orderBy: { sortOrder: 'asc' }
                    }
                },
                orderBy: { id: 'desc' }
            });
            res.json(products);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch products' });
        }
    }

    // Get public products (filtered by category)
    async getProducts(req, res) {
        const { categoryId, lang } = req.query; // lang not strictly used for filtering but good to know

        try {
            const where = {};
            if (categoryId) where.categoryId = parseInt(categoryId);

            const products = await prisma.product.findMany({
                where,
                include: {
                    category: {
                        include: {
                            translations: true
                        }
                    },
                    translations: true,
                    images: {
                        orderBy: { sortOrder: 'asc' }
                    }
                },
                orderBy: { id: 'desc' }
            });

            // Optional: Map to simplified structure if frontend needs it, 
            // but Catalog.jsx seems to handle the full object (checking specs.dimensions etc)
            // Catalog.jsx uses: product.image (singular), product.title, product.specs.dimensions, product.category (string)
            // We might need to transform the response to match frontend expectations if it was using a different format before.
            // Let's look at Catalog.jsx again.
            // It expects: product.image, product.title, product.specs?.dimensions
            // But our DB model has product.images (array), product.translations, product.dimensions (direct field).
            // So we need to MAP the data.

            const formatted = products.map(p => {
                const t = p.translations.find(tr => tr.locale === (lang || 'az')) || p.translations[0] || {};
                const catT = p.category.translations.find(tr => tr.locale === (lang || 'az')) || p.category.translations[0] || {};
                const mainImg = p.images.find(i => i.isMain) || p.images[0];

                return {
                    id: p.id,
                    title: t.title || 'Untitled',
                    category: catT.name || 'Uncategorized',
                    code: p.code,
                    price: p.price,
                    image: mainImg ? mainImg.imagePath : null, // Catalog.jsx uses 'image'
                    specs: {
                        dimensions: p.dimensions
                    }
                };
            });

            res.json(formatted);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch public products' });
        }
    }

    // Get public product detail
    async getProductDetail(req, res) {
        const { id } = req.params;
        const { lang } = req.query;

        try {
            const product = await prisma.product.findUnique({
                where: { id: parseInt(id) },
                include: {
                    translations: true,
                    images: { orderBy: { sortOrder: 'asc' } }
                }
            });

            if (!product) return res.status(404).json({ error: 'Product not found' });

            const t = product.translations.find(tr => tr.locale === (lang || 'az')) || product.translations[0] || {};

            // Map images to correct full URLs
            const images = product.images.map(img =>
                img.imagePath.startsWith('http') ? img.imagePath : `http://localhost:3000${img.imagePath}`
            );

            const result = {
                id: product.id,
                title: t.title || 'Untitled',
                description: t.description || '',
                code: product.code,
                specs: {
                    dimensions: product.dimensions,
                    weight: product.weight,
                    material: product.materialType
                },
                price: product.price,
                images: images
            };

            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch product detail' });
        }
    }

    // Get single product (Admin Raw)
    async getProduct(req, res) {
        const { id } = req.params;
        try {
            const product = await prisma.product.findUnique({
                where: { id: parseInt(id) },
                include: {
                    translations: true,
                    images: { orderBy: { sortOrder: 'asc' } }
                }
            });
            if (!product) return res.status(404).json({ error: 'Product not found' });
            res.json(product);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch product' });
        }
    }

    // Create product
    async createProduct(req, res) {
        const {
            categoryId, code, dimensions, weight, materialType, price,
            translations, images // images array of { imagePath, isMain, sortOrder }
        } = req.body;

        try {
            const result = await prisma.$transaction(async (prisma) => {
                // Create basic product
                const product = await prisma.product.create({
                    data: {
                        categoryId: parseInt(categoryId),
                        code,
                        dimensions,
                        weight,
                        materialType,
                        price
                    }
                });

                // Create translations
                if (translations && Array.isArray(translations)) {
                    await prisma.productTranslation.createMany({
                        data: translations.map(t => ({
                            productId: product.id,
                            locale: t.locale,
                            title: t.title,
                            description: t.description
                        }))
                    });
                }

                // Create images
                if (images && Array.isArray(images)) {
                    await prisma.productImage.createMany({
                        data: images.map((img, index) => ({
                            productId: product.id,
                            imagePath: img.imagePath,
                            isMain: img.isMain || false,
                            sortOrder: index
                        }))
                    });
                }

                return product;
            });

            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create product' });
        }
    }

    // Update product
    async updateProduct(req, res) {
        const { id } = req.params;
        const {
            categoryId, code, dimensions, weight, materialType, price,
            translations, images
        } = req.body;

        try {
            await prisma.$transaction(async (prisma) => {
                // Update basic fields
                await prisma.product.update({
                    where: { id: parseInt(id) },
                    data: {
                        categoryId: parseInt(categoryId),
                        code,
                        dimensions,
                        weight,
                        materialType,
                        price
                    }
                });

                // Update translations (delete and recreate is simplest safe strategy for now, or upsert)
                // Using deleteMany + createMany for simplicity
                await prisma.productTranslation.deleteMany({ where: { productId: parseInt(id) } });
                if (translations && Array.isArray(translations)) {
                    await prisma.productTranslation.createMany({
                        data: translations.map(t => ({
                            productId: parseInt(id),
                            locale: t.locale,
                            title: t.title,
                            description: t.description
                        }))
                    });
                }

                // Update images
                // Strategy: Delete all and recreate. 
                // OR: Smart update. For MVP, delete all and recreate is robust if we pass full list back.
                if (images) {
                    await prisma.productImage.deleteMany({ where: { productId: parseInt(id) } });
                    if (Array.isArray(images) && images.length > 0) {
                        await prisma.productImage.createMany({
                            data: images.map((img, index) => ({
                                productId: parseInt(id),
                                imagePath: img.imagePath,
                                isMain: img.isMain || false,
                                sortOrder: index
                            }))
                        });
                    }
                }
            });

            res.json({ message: 'Product updated' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to update product' });
        }
    }

    // Delete product
    async deleteProduct(req, res) {
        const { id } = req.params;
        try {
            await prisma.$transaction(async (prisma) => {
                await prisma.productImage.deleteMany({ where: { productId: parseInt(id) } });
                await prisma.productTranslation.deleteMany({ where: { productId: parseInt(id) } });
                await prisma.product.delete({ where: { id: parseInt(id) } });
            });
            res.json({ message: 'Product deleted' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to delete product' });
        }
    }
}

module.exports = new ProductController();
