const authService = require('../services/auth');

class AuthController {
  // PUBLIC_INTERFACE
  async register(req, res) {
    try {
      const { email, password, name } = req.body || {};
      if (!email || !password) {
        return res.status(400).json({ error: 'email and password are required' });
      }
      const result = await authService.registerUser({ email, password, name });
      return res.status(201).json(result);
    } catch (err) {
      return res.status(400).json({ error: err.message || 'Registration failed' });
    }
  }

  // PUBLIC_INTERFACE
  async login(req, res) {
    try {
      const { email, password } = req.body || {};
      if (!email || !password) {
        return res.status(400).json({ error: 'email and password are required' });
      }
      const result = await authService.loginUser({ email, password });
      return res.status(200).json(result);
    } catch (err) {
      return res.status(401).json({ error: err.message || 'Login failed' });
    }
  }
}

module.exports = new AuthController();
