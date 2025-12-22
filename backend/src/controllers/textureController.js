const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class TextureController {
    // Get all textures (admin/public)
    async getAll(req, res) {
        try {
            const textures = await prisma.texture.findMany({
                include: { translations: true },
                orderBy: { sortOrder: 'asc' }
            });
            res.json(textures);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch textures' });
        }
    }

    // Create texture
    async create(req, res) {
        let { azName, enName, ruName, type, imagePath, translations } = req.body;

        // Handle array payload
        if (translations && Array.isArray(translations)) {
            azName = translations.find(t => t.locale === 'az')?.name || '';
            enName = translations.find(t => t.locale === 'en')?.name || '';
            ruName = translations.find(t => t.locale === 'ru')?.name || '';
        }

        try {
            const texture = await prisma.texture.create({
                data: {
                    type,
                    imagePath,
                    translations: {
                        create: [
                            { locale: 'az', name: azName || '' },
                            { locale: 'en', name: enName || '' },
                            { locale: 'ru', name: ruName || '' }
                        ]
                    }
                },
                include: { translations: true }
            });
            res.json(texture);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create texture' });
        }
    }

    // Update texture
    async update(req, res) {
        const { id } = req.params;
        let { azName, enName, ruName, type, imagePath, translations } = req.body;

        // Handle array payload
        if (translations && Array.isArray(translations)) {
            azName = translations.find(t => t.locale === 'az')?.name;
            enName = translations.find(t => t.locale === 'en')?.name;
            ruName = translations.find(t => t.locale === 'ru')?.name;
        }

        try {
            // Update base fields
            await prisma.texture.update({
                where: { id: parseInt(id) },
                data: { type, imagePath }
            });

            // Update translations (upsert logic)
            const locales = [
                { locale: 'az', name: azName },
                { locale: 'en', name: enName },
                { locale: 'ru', name: ruName }
            ];

            for (const item of locales) {
                if (item.name !== undefined) {
                    await prisma.textureTranslation.upsert({
                        where: {
                            textureId_locale: {
                                textureId: parseInt(id),
                                locale: item.locale
                            }
                        },
                        update: { name: item.name },
                        create: {
                            textureId: parseInt(id),
                            locale: item.locale,
                            name: item.name
                        }
                    });
                }
            }

            const updated = await prisma.texture.findUnique({
                where: { id: parseInt(id) },
                include: { translations: true }
            });
            res.json(updated);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to update texture' });
        }
    }

    // Delete texture
    async delete(req, res) {
        const { id } = req.params;
        try {
            await prisma.texture.delete({
                where: { id: parseInt(id) }
            });
            res.json({ message: 'Texture deleted' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to delete texture' });
        }
    }
}

module.exports = new TextureController();
