const authService = require('../services/authService');

class AuthController {
  async login(req, res, next) {
    try {
      const { username, password } = req.body;
      const data = await authService.login(username, password);

      res.status(200).json({
        success: true,
        message: 'Login successful.',
        data,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async verifySession(req, res, next) {
    try {
      const userId = req.user.id;
      const user = await authService.verifySession(userId);

      res.status(200).json({
        success: true,
        message: 'Session is valid.',
        data: { user },
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
