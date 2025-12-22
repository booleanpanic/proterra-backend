const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class HeroSlideController {
    // Get all slides (admin/public)
    async getAll(req, res) {
        try {
            const slides = await prisma.heroSlide.findMany({
                include: { translations: true },
                orderBy: { sortOrder: 'asc' }
            });
            res.json(slides);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch slides' });
        }
    }

    // Create slide
    async create(req, res) {
        let { imagePath, azTitle, azSubtitle, enTitle, enSubtitle, ruTitle, ruSubtitle, translations } = req.body;

        // Handle array payload
        if (translations && Array.isArray(translations)) {
            azTitle = translations.find(t => t.locale === 'az')?.title || '';
            azSubtitle = translations.find(t => t.locale === 'az')?.subtitle || '';
            enTitle = translations.find(t => t.locale === 'en')?.title || '';
            enSubtitle = translations.find(t => t.locale === 'en')?.subtitle || '';
            ruTitle = translations.find(t => t.locale === 'ru')?.title || '';
            ruSubtitle = translations.find(t => t.locale === 'ru')?.subtitle || '';
        }

        try {
            const slide = await prisma.heroSlide.create({
                data: {
                    imagePath,
                    sortOrder: 0,
                    translations: {
                        create: [
                            { locale: 'az', title: azTitle || '', subtitle: azSubtitle || '' },
                            { locale: 'en', title: enTitle || '', subtitle: enSubtitle || '' },
                            { locale: 'ru', title: ruTitle || '', subtitle: ruSubtitle || '' }
                        ]
                    }
                },
                include: { translations: true }
            });
            res.json(slide);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create slide' });
        }
    }

    // Update slide
    async update(req, res) {
        const { id } = req.params;
        let { imagePath, azTitle, azSubtitle, enTitle, enSubtitle, ruTitle, ruSubtitle, translations } = req.body;

        // Handle array payload
        if (translations && Array.isArray(translations)) {
            azTitle = translations.find(t => t.locale === 'az')?.title;
            azSubtitle = translations.find(t => t.locale === 'az')?.subtitle;
            enTitle = translations.find(t => t.locale === 'en')?.title;
            enSubtitle = translations.find(t => t.locale === 'en')?.subtitle;
            ruTitle = translations.find(t => t.locale === 'ru')?.title;
            ruSubtitle = translations.find(t => t.locale === 'ru')?.subtitle;
        }

        try {
            await prisma.heroSlide.update({
                where: { id: parseInt(id) },
                data: { imagePath }
            });

            const locales = [
                { locale: 'az', title: azTitle, subtitle: azSubtitle },
                { locale: 'en', title: enTitle, subtitle: enSubtitle },
                { locale: 'ru', title: ruTitle, subtitle: ruSubtitle }
            ];

            for (const item of locales) {
                if (item.title !== undefined || item.subtitle !== undefined) {
                    await prisma.heroSlideTranslation.upsert({
                        where: {
                            slideId_locale: {
                                slideId: parseInt(id),
                                locale: item.locale
                            }
                        },
                        update: { title: item.title, subtitle: item.subtitle },
                        create: {
                            slideId: parseInt(id),
                            locale: item.locale,
                            title: item.title || '',
                            subtitle: item.subtitle || ''
                        }
                    });
                }
            }

            const updated = await prisma.heroSlide.findUnique({
                where: { id: parseInt(id) },
                include: { translations: true }
            });
            res.json(updated);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to update slide' });
        }
    }

    // Delete slide
    async delete(req, res) {
        const { id } = req.params;
        try {
            await prisma.heroSlide.delete({
                where: { id: parseInt(id) }
            });
            res.json({ message: 'Slide deleted' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to delete slide' });
        }
    }
}

module.exports = new HeroSlideController();
