const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const frontendDir = path.join(rootDir, 'frontend');
const backendDir = path.join(rootDir, 'backend');
const backendPublicDir = path.join(backendDir, 'public');

console.log('🚀 Starting Production Build...');

try {
    // 1. Install Frontend Dependencies
    console.log('\n📦 Installing Frontend Dependencies...');
    execSync('npm install', { cwd: frontendDir, stdio: 'inherit', shell: true });

    // 2. Build Frontend
    console.log('\n🏗️  Building Frontend...');
    execSync('npm run build', { cwd: frontendDir, stdio: 'inherit', shell: true });

    // 3. Move Build to Backend Public
    console.log('\n🚚 Moving Build Artifacts to Backend...');

    // Clear existing public folder (except uploads if any, but usually we keep uploads outside or be careful)
    // For simplicity, we remove everything and recreate, asking user to persist uploads elsewhere if needed
    // OR just remove static assets. Let's be safe and just copy over.

    // Simplified: React build goes to backend/public
    // Ensure directory exists
    if (!fs.existsSync(backendPublicDir)) {
        fs.mkdirSync(backendPublicDir, { recursive: true });
    }

    // Recursively copy function
    function copyFolderSync(from, to) {
        if (!fs.existsSync(to)) fs.mkdirSync(to);
        const entries = fs.readdirSync(from, { withFileTypes: true });

        for (let entry of entries) {
            const srcPath = path.join(from, entry.name);
            const destPath = path.join(to, entry.name);

            if (entry.isDirectory()) {
                copyFolderSync(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        }
    }

    // Delete old assets to avoid clutter (optional, skip for safety of uploads unless uploads is separate)
    // Assuming uploads is in public/uploads, we should preserve it.
    // React build output: assets, index.html, vite.svg etc.
    // We copy from frontend/dist to backend/public
    copyFolderSync(path.join(frontendDir, 'dist'), backendPublicDir);

    // 4. Install Backend Dependencies
    console.log('\n📦 Installing Backend Dependencies...');
    execSync('npm install', { cwd: backendDir, stdio: 'inherit', shell: true });

    // 5. Prisma Check
    console.log('\n🗄️  Generating Prisma Client...');
    execSync('npx prisma generate', { cwd: backendDir, stdio: 'inherit', shell: true });

    console.log('\n✅ Build Complete! App is ready for deployment.');
    console.log('👉 To start: cd backend && npm start');

} catch (error) {
    console.error('\n❌ Build Failed:', error);
    process.exit(1);
}
