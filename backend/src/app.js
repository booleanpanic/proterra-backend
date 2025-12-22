const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const compression = require('compression');
const helmet = require('helmet');

const rateLimit = require('express-rate-limit');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Security Middleware
app.use(compression());
app.use(helmet({
    contentSecurityPolicy: false,
}));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // limit each IP to 1000 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// CORS Config
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? false // Disable CORS in production monolith (same origin) or set specific domain
        : '*',  // Allow all in dev
};
app.use(cors(corsOptions));
app.use(express.json());

const apiRoutes = require('./routes/api');

const path = require('path');
const uploadRoutes = require('./routes/upload');

app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
app.use(express.static(path.join(__dirname, '../public'))); // Serve all static files from public
app.use('/api', apiRoutes);
app.use('/api/upload', uploadRoutes);

// SPA Catch-all: Serve index.html for any unknown routes (must be AFTER API routes)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

async function main() {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
