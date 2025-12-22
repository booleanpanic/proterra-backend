const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
});

const uploadMiddleware = upload.single('image');

router.post('/', (req, res, next) => {
    // Log before processing
    try {
        const log = `[${new Date().toISOString()}] Incoming Request: Content-Length=${req.headers['content-length']} Content-Type=${req.headers['content-type']}\n`;
        fs.appendFileSync(path.join(__dirname, '../../upload_debug.log'), log);
    } catch (e) {
        console.error('Logging failed', e);
    }

    uploadMiddleware(req, res, (err) => {
        if (err) {
            console.error('Multer Error:', err);
            try {
                fs.appendFileSync(path.join(__dirname, '../../upload_debug.log'), `Multer Error: ${err.message} code=${err.code}\n`);
            } catch (e) { console.error('Logging failed', e); }

            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({ error: 'File too large (Max 5MB)' });
                }
                return res.status(500).json({ error: err.message });
            }
            return res.status(500).json({ error: 'Upload error: ' + err.message });
        }

        // Success
        try {
            const log = `[${new Date().toISOString()}] Upload Success: File=${req.file ? req.file.filename : 'MISSING'}\n`;
            fs.appendFileSync(path.join(__dirname, '../../upload_debug.log'), log);
        } catch (e) { }

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const fileUrl = `/uploads/${req.file.filename}`;
        res.json({ url: fileUrl });
    });
});

module.exports = router;
