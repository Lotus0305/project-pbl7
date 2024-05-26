const accountService = require("../services/accountService");

const accountController = {
  getAccounts: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const sortField = req.query.sortField || null;
      const sortOrder = req.query.sortOrder || "asc";

      const result = await accountService.getAccounts(
        page,
        pageSize,
        sortField,
        sortOrder
      );
      res.json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  getAccount: async (req, res) => {
    try {
      const account = await accountService.getAccount(req.params.id);
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }
      res.status(200).json(account);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  addAccount: async (req, res) => {
    try {
      const accountRes = await accountService.addAccount(req.body);
      res.status(200).json(accountRes);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  updateAccount: async (req, res) => {
    try {
      const account = await accountService.updateAccount(
        req.params.id,
        req.body
      );
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }
      res.status(200).json(account);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  deleteAccount: async (req, res) => {
    try {
      const account = await accountService.getAccount(req.params.id);
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }
      await accountService.deleteAccount(req.params.id);
      res.status(200).json({ message: "Account has been deleted" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  likeNovel: async (req, res) => {
    try {
      const { accountId, novelId } = req.params;
      const likedNovels = await accountService.likeNovel(accountId, novelId);
      res.status(200).json({ message: "Novel liked", likedNovels });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  unlikeNovel: async (req, res) => {
    try {
      const { accountId, novelId } = req.params;
      const likedNovels = await accountService.unlikeNovel(accountId, novelId);
      res.status(200).json({ message: "Novel unliked", likedNovels });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  validateAccountData: async (req, res, next) => {
    try {
      const { username, email } = req.body;
      const accountId = req.params.id;

      // Check if username is already taken by another account
      if (username) {
        const existingUsername = await Account.findOne({ username });
        if (existingUsername && existingUsername._id.toString() !== accountId) {
          return res.status(400).json({ message: "Username already exists" });
        }
      }

      // Check if email is already taken by another account
      if (email) {
        const existingEmail = await Account.findOne({ email });
        if (existingEmail && existingEmail._id.toString() !== accountId) {
          return res.status(400).json({ message: "Email already exists" });
        }
      }

      next();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = accountController;
