const Account = require("../model/account");
const Role = require("../model/role");

const accountController = {
  getAccounts: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const sortField = req.query.sortField || null;
      const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;

      const skip = (page - 1) * pageSize;
      let sortObject = {};
      if (sortField) {
        sortObject[sortField] = sortOrder;
      }

      const accounts = await Account.find()
        .skip(skip)
        .limit(pageSize)
        .sort(sortObject)
        .select("-password")
        .populate("role", "_id name");

      const total = await Account.countDocuments();

      res.json({
        totalPages: Math.ceil(total / pageSize),
        currentPage: page,
        accounts,
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  getAccount: async (req, res) => {
    try {
      const accounts = await Account.findById(req.params.id).select(
        "-password"
      );
      if (!accounts) {
        return res.status(404).json({ message: "Account not found" });
      }
      accounts = accounts.select("-password").populate("role", "_id name");
      res.status(200).json(accounts);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  addAccount: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.password, salt);
      const role = await Role.findOne({ name: req.body.role });
      const account = await Account.create({
        username: req.body.username,
        password: hash,
        email: req.body.email,
        role: role,
      });
      account = await Account.findById(account._id)
        .select("-password")
        .populate("role", "_id name");
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
      )
        .select("-password")
        .populate("role", "_id name");
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

  // check id role
  validateAccountData: async (req, res, next) => {
    const role = await Role.findOne({ name: req.body.role });
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }
    next();
  },
};

module.exports = accountController;
