const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const logger = require('../config/logger');

// Define directory constants
const PUBLIC_DIR = path.join(__dirname, '../public');
const CLIENTS_UPLOAD_DIR = path.join(PUBLIC_DIR, 'uploads', 'clients');
const EMPLOYEES_UPLOAD_DIR = path.join(PUBLIC_DIR, 'uploads', 'employees');

// Ensure directories exist synchronously on module load
[PUBLIC_DIR, path.join(PUBLIC_DIR, 'uploads'), CLIENTS_UPLOAD_DIR, EMPLOYEES_UPLOAD_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

class ImageService {
  /**
   * Process and compress a Client Logo to WebP format (max 400x400)
   * Fit: 'inside' without enlargement or 'contain' to preserve logos perfectly
   * @param {Buffer} buffer - Raw file buffer from Multer
   * @param {string} originalName - Original filename for sanitization
   * @returns {Promise<{ filename: string, relativeUrl: string, sizeBytes: number, format: string, width: number, height: number }>}
   */
  async processClientLogo(buffer, originalName = 'logo') {
    if (!buffer || !Buffer.isBuffer(buffer)) {
      throw new Error('Valid image buffer is required for processing.');
    }

    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const filename = `client_${timestamp}_${randomSuffix}.webp`;
    const outputPath = path.join(CLIENTS_UPLOAD_DIR, filename);

    // Process with sharp
    const sharpInstance = sharp(buffer)
      .rotate() // auto-rotate based on EXIF orientation
      .resize(400, 400, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({
        quality: 80,
        effort: 4,
        lossless: false
      });

    const info = await sharpInstance.toFile(outputPath);
    const relativeUrl = `/public/uploads/clients/${filename}`;

    logger.info(`Client logo processed: ${filename}, original size: ${(buffer.length / 1024).toFixed(1)} KB -> webp size: ${(info.size / 1024).toFixed(1)} KB`);

    return {
      filename,
      relativeUrl,
      sizeBytes: info.size,
      format: 'webp',
      width: info.width,
      height: info.height
    };
  }

  /**
   * Process and compress an Employee Profile Photo to WebP format (max 400x400, cover fit)
   * @param {Buffer} buffer - Raw file buffer from Multer
   * @param {string} originalName - Original filename for sanitization
   * @returns {Promise<{ filename: string, relativeUrl: string, sizeBytes: number, format: string, width: number, height: number }>}
   */
  async processEmployeePhoto(buffer, originalName = 'photo') {
    if (!buffer || !Buffer.isBuffer(buffer)) {
      throw new Error('Valid image buffer is required for processing.');
    }

    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const filename = `emp_${timestamp}_${randomSuffix}.webp`;
    const outputPath = path.join(EMPLOYEES_UPLOAD_DIR, filename);

    // Process with sharp: 400x400 square cover for perfect circular avatars
    const sharpInstance = sharp(buffer)
      .rotate() // auto-rotate based on EXIF orientation
      .resize(400, 400, {
        fit: 'cover',
        position: sharp.strategy.entropy // focus on highest entropy / face region
      })
      .webp({
        quality: 80,
        effort: 4,
        lossless: false
      });

    const info = await sharpInstance.toFile(outputPath);
    const relativeUrl = `/public/uploads/employees/${filename}`;

    logger.info(`Employee photo processed: ${filename}, original size: ${(buffer.length / 1024).toFixed(1)} KB -> webp size: ${(info.size / 1024).toFixed(1)} KB`);

    return {
      filename,
      relativeUrl,
      sizeBytes: info.size,
      format: 'webp',
      width: info.width,
      height: info.height
    };
  }

  /**
   * Delete a local image file safely if it starts with /public/uploads/
   * @param {string} relativeUrl 
   */
  async deleteLocalImage(relativeUrl) {
    if (!relativeUrl || typeof relativeUrl !== 'string') return;
    
    // Only delete files under /public/uploads to prevent directory traversal
    const normalized = relativeUrl.replace(/^[\/\\]+/, '');
    if (!normalized.startsWith('public/uploads/') && !normalized.startsWith('public\\uploads\\')) {
      return;
    }

    const fullPath = path.join(__dirname, '..', normalized);
    try {
      if (fs.existsSync(fullPath)) {
        await fs.promises.unlink(fullPath);
        logger.info(`Deleted old image file: ${fullPath}`);
      }
    } catch (err) {
      logger.error(`Error deleting image file ${fullPath}:`, err.message);
    }
  }
}

module.exports = new ImageService();
