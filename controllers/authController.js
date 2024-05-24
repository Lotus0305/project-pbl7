const authService = require("../services/authService");

const authController = {
  register: async (req, res) => {
    try {
      const accountRes = await authService.register(req.body);
      res.status(200).json(accountRes);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const { accessToken, refreshToken } = await authService.login(username, password);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false, // set true if using https
        path: "/",
        sameSite: "strict",
      });
      res.status(200).json({ accessToken });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  refreshToken: async (req, res) => {
    try {
      const { refreshToken } = req.cookies;
      const tokens = await authService.refreshToken(refreshToken);

      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: false, // set true if using https
        path: "/",
        sameSite: "strict",
      });
      res.status(200).json({ accessToken: tokens.accessToken });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  logout: async (req, res) => {
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logout success" });
  },
};

module.exports = authController;
