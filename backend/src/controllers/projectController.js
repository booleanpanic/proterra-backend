const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all projects with translations and images
const getAll = async (req, res) => {
    try {
        const projects = await prisma.project.findMany({
            include: {
                translations: true,
                images: {
                    orderBy: {
                        sortOrder: 'asc'
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
};

// Create a new project
const create = async (req, res) => {
    const { translations, images } = req.body;
    // translations: [{ locale: 'en', title: '...', description: '...' }, ...]
    // images: ['/path/to/img1.jpg', '/path/to/img2.jpg', ...]

    try {
        const project = await prisma.project.create({
            data: {
                translations: {
                    create: translations.map(t => ({
                        locale: t.locale,
                        title: t.title || '',
                        description: t.description || ''
                    }))
                },
                images: {
                    create: images.map((path, index) => ({
                        imagePath: path,
                        sortOrder: index,
                        isMain: index === 0
                    }))
                }
            },
            include: {
                translations: true,
                images: true
            }
        });

        res.status(201).json(project);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Failed to create project' });
    }
};

// Update an existing project
const update = async (req, res) => {
    const { id } = req.params;
    const { translations, images } = req.body;

    try {
        // Update translations
        const translationPromises = translations.map(t =>
            prisma.projectTranslation.upsert({
                where: {
                    projectId_locale: {
                        projectId: parseInt(id),
                        locale: t.locale
                    }
                },
                update: {
                    title: t.title,
                    description: t.description
                },
                create: {
                    projectId: parseInt(id),
                    locale: t.locale,
                    title: t.title || '',
                    description: t.description || ''
                }
            })
        );

        await Promise.all(translationPromises);

        // Update images
        if (images && Array.isArray(images)) {
            // Delete all existing images for this project
            await prisma.projectImage.deleteMany({
                where: { projectId: parseInt(id) }
            });

            // Create new ones
            await prisma.projectImage.createMany({
                data: images.map((path, index) => ({
                    projectId: parseInt(id),
                    imagePath: path,
                    sortOrder: index,
                    isMain: index === 0
                }))
            });
        }

        const updatedProject = await prisma.project.findUnique({
            where: { id: parseInt(id) },
            include: {
                translations: true,
                images: { orderBy: { sortOrder: 'asc' } }
            }
        });

        res.json(updatedProject);
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Failed to update project' });
    }
};

// Delete a project
const remove = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.project.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Failed to delete project' });
    }
};

module.exports = {
    getAll,
    create,
    update,
    remove
};
