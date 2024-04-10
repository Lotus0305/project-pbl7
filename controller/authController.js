const bcrypt = require("bcrypt");
const Account = require("../model/account");
const Role = require("../model/role");

const authController = {
  register: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.password, salt);

      const roleUser = await Role.findOne({ name: "user" });

      const account = await Account.create({
        username: req.body.username,
        password: hash,
        email: req.body.email,
        role: roleUser,
      });
      res.status(200).json(account);
    } catch (error) {
      res.status(400).json({ message: error.message });
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
        res.status(200).json(account);
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = authController;
