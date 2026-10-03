const imageService = require('../services/imageService');

class UploadController {
  async uploadClientLogo(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No logo image file was uploaded. Please attach an image file.',
          errors: ['Image file required']
        });
      }

      const result = await imageService.processClientLogo(req.file.buffer, req.file.originalname);

      return res.status(200).json({
        success: true,
        message: 'Client logo uploaded and compressed to WebP successfully.',
        data: {
          url: result.relativeUrl,
          relativeUrl: result.relativeUrl,
          filename: result.filename,
          sizeBytes: result.sizeBytes,
          format: result.format,
          width: result.width,
          height: result.height
        },
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async uploadEmployeePhoto(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No employee photo was uploaded. Please attach an image file.',
          errors: ['Image file required']
        });
      }

      const result = await imageService.processEmployeePhoto(req.file.buffer, req.file.originalname);

      return res.status(200).json({
        success: true,
        message: 'Employee photo uploaded and compressed to WebP successfully.',
        data: {
          url: result.relativeUrl,
          relativeUrl: result.relativeUrl,
          filename: result.filename,
          sizeBytes: result.sizeBytes,
          format: result.format,
          width: result.width,
          height: result.height
        },
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UploadController();
