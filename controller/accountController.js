const Account = require("../model/account");

const accountController = {
  getAccounts: async (req, res) => {
    try {
      const accounts = await Account.find().select("-password");
      res.status(200).json(accounts);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  getAccount: async (req, res) => {
    try {
      const accounts = await Account.findById(req.params.id);
      if (!accounts) {
        return res.status(404).json({ message: "Account not found" });
      }
      accounts = accounts.select("-password");
      res.status(200).json(accounts);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  addAccount: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.password, salt);
      const role = await Role.findOne({ name: req.body.role});
      const account = await Account.create({
        username: req.body.username,
        password: hash,
        email: req.body.email,
        role: role,
      });

      res.status(200).json(account);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  updateAccount: async (req, res) => {
    try {
      const accounts = await Account.findById(req.params.id);
      if (!accounts) {
        return res.status(404).json({ message: "Account not found" });
      }

      const updateAccount = await Account.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updateAccount);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  deleteAccount: async (req, res) => {
    try {
      const accounts = await Account.findById(req.params.id);
      if (!accounts) {
        return res.status(404).json({ message: "Account not found" });
      }

      await Account.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Account has been deleted" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
};

module.exports = accountController;
