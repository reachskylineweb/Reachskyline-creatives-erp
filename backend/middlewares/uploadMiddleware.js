const multer = require('multer');

// Configure multer with memory storage so sharp can process the buffer directly
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Allow common image mime types
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'image/bmp',
    'image/tiff',
    'image/avif'
  ];

  if (allowedMimeTypes.includes(file.mimetype) || file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    const error = new Error('Only image files (JPEG, PNG, WebP, GIF, SVG, BMP) are allowed.');
    error.statusCode = 400;
    cb(error, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024 // 15MB max file size
  }
});

// Middleware helper that accepts a single file under common field names ('file', 'image', 'logo', 'photo')
const singleUpload = (fieldNames = ['file', 'image', 'logo', 'photo']) => {
  return (req, res, next) => {
    // Try any field or single matching field
    upload.fields(fieldNames.map(name => ({ name, maxCount: 1 })))(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'Image file is too large. Maximum allowed size is 15MB.',
            errors: ['File size limit exceeded']
          });
        }
        return res.status(400).json({
          success: false,
          message: `Upload error: ${err.message}`,
          errors: [err.code]
        });
      } else if (err) {
        return res.status(err.statusCode || 400).json({
          success: false,
          message: err.message || 'Error uploading file.',
          errors: [err.message]
        });
      }

      // Consolidate found file to req.file
      if (req.files) {
        for (const name of fieldNames) {
          if (req.files[name] && req.files[name][0]) {
            req.file = req.files[name][0];
            break;
          }
        }
      }

      next();
    });
  };
};

module.exports = {
  upload,
  singleUpload,
  uploadClientLogo: singleUpload(['logo', 'file', 'image']),
  uploadEmployeePhoto: singleUpload(['photo', 'file', 'image', 'avatar'])
};
