const Account = require("../model/account");

const accountController = {
  getAccounts: (req, res) => {
    try {
      const accounts = Account.find();
      res.status(200).json(accounts);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  addAccount: (req, res) => {
    try {
      const account = new Account(req.body);
      const saveAccount = account.save();
      res.status(200).json(saveAccount);
    } catch (error) {
      res.status(400).json({ message: err.message });
    }
  },
  updateAccount: (req, res) => {
    try {
      const account = Account.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(account);
    } catch (error) {
      res.status(400).json({ message: err.message });
    }
  },
  deleteAccount: (req, res) => {
    try {
      Account.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Account has been deleted" });
    } catch (error) {
      res.status(400).json({ message: err.message });
    }
  },
};

module.exports = accountController;
