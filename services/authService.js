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
      role: roleCustomer._id, // Lưu trữ ID của vai trò
    });
    const accountRes = await Account.findById(account._id)
      .select("-password")
      .populate("role", "_id name"); // Populate để lấy thông tin chi tiết của vai trò
    return accountRes;
  },

  login: async (username, password) => {
    const account = await Account.findOne({ username }).populate("role", "_id name"); // Populate để lấy thông tin chi tiết của vai trò
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
      jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, async (err, decoded) => {
        if (err) {
          return reject(new Error("Forbidden"));
        }

        // Truy xuất thông tin tài khoản từ ID và populate role
        const account = await Account.findById(decoded.id).populate("role", "_id name");
        if (!account) {
          return reject(new Error("Account not found"));
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
        id: account._id, // Sử dụng _id thay vì id
        role: account.role.name,
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "5m" }
    );
  },

  generateRefreshToken: (account) => {
    return jwt.sign(
      {
        id: account._id, // Sử dụng _id thay vì id
        role: account.role.name,
      },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "30d" }
    );
  },
};

module.exports = authService;
