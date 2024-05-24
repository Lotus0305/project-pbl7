const bcrypt = require("bcryptjs");
const Account = require("../models/account");
const Role = require("../models/role");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const authService = {
  register: async (accountData) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(accountData.password, salt);
    const roleCustomer = await Role.findOne({ name: "customer" });
    const account = await Account.create({
      username: accountData.username,
      password: hash,
      name: accountData.name,
      email: accountData.email,
      role: roleCustomer,
    });
    const accountRes = await Account.findById(account._id)
      .select("-password")
      .populate("role", "_id name");
    return accountRes;
  },

  login: async (username, password) => {
    const account = await Account.findOne({ username });
    if (!account) {
      throw new Error("Account not found");
    }
    const validPassword = await bcrypt.compare(password, account.password);
    if (!validPassword) {
      throw new Error("Invalid password");
    }
    const accessToken = authService.generateAccessToken(account);
    const refreshToken = authService.generateRefreshToken(account);

    return { accessToken, refreshToken };
  },

  refreshToken: (refreshToken) => {
    if (!refreshToken) {
      throw new Error("Unauthorized");
    }
    return new Promise((resolve, reject) => {
      jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, account) => {
        if (err) {
          return reject(new Error("Forbidden"));
        }
        const accessToken = authService.generateAccessToken(account);
        const newRefreshToken = authService.generateRefreshToken(account);
        resolve({ accessToken, refreshToken: newRefreshToken });
      });
    });
  },

  generateAccessToken: (account) => {
    return jwt.sign(
      {
        id: account.id,
        role: account.role.name,
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "5m" }
    );
  },

  generateRefreshToken: (account) => {
    return jwt.sign(
      {
        id: account.id,
        role: account.role.name,
      },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "30d" }
    );
  },
};

module.exports = authService;
