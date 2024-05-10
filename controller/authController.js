const bcrypt = require("bcryptjs");
const Account = require("../model/account");
const Role = require("../model/role");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const authController = {
  register: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.password, salt);
      const roleCustomer = await Role.findOne({ name: "customer" });
      const account = await Account.create({
        username: req.body.username,
        password: hash,
        name: req.body.name,
        email: req.body.email,
        role: roleCustomer,
      });
      const accountRes = await Account.findById(account._id)
        .select("-password")
        .populate("role", "_id name");
      res.status(200).json(accountRes);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const account = await Account.findOne({ username: req.body.username });
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }
      const validPassword = await bcrypt.compare(
        req.body.password,
        account.password
      );
      if (!validPassword) {
        return res.status(400).json({ message: "Invalid password" });
      } else {
        const accessToken = authController.generateAccessToken(account);
        const refreshToken = authController.generateRefreshToken(account);

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false, // set true if using https
          path: "/",
          sameSite: "strict",
        });
        res.status(200).json({ accessToken });
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  refreshToken: async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, account) => {
        if (err) {
          return res.status(403).json({ message: "Forbidden" });
        }
        const accessToken = authController.generateAccessToken(account);
        const refreshToken = authController.generateRefreshToken(account);

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false, // set true if using https
          path: "/",
          sameSite: "strict",
        });
        res.status(200).json({ accessToken });
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  logout: async (req, res) => {
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logout success" });
  },

  generateAccessToken: (account) => {
    const accessToken = jwt.sign(
      {
        id: account.id,
        role: account.role.name,
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "5m" }
    );
    return accessToken;
  },

  generateRefreshToken: (account) => {
    const accessToken = jwt.sign(
      {
        id: account.id,
        role: account.role.name,
      },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "30d" }
    );
    return accessToken;
  },
};

module.exports = authController;
