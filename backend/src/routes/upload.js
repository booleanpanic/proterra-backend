const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Storage Config
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'proterra-uploads', // Folder in Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        // transformation: [{ width: 1920, height: 1080, crop: 'limit' }] // Optional resizing
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

const uploadMiddleware = upload.single('image');

router.post('/', (req, res) => {
    uploadMiddleware(req, res, (err) => {
        if (err) {
            console.error('Upload Error:', err);
            return res.status(500).json({ error: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Cloudinary returns the URL in req.file.path
        res.json({ url: req.file.path });
    });
});

module.exports = router;
