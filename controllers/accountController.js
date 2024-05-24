const accountService = require("../services/accountService");

const accountController = {
  getAccounts: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const sortField = req.query.sortField || null;
      const sortOrder = req.query.sortOrder || "asc";

      const result = await accountService.getAccounts(page, pageSize, sortField, sortOrder);
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
      const account = await accountService.updateAccount(req.params.id, req.body);
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

  validateAccountData: async (req, res, next) => {
    try {
      const role = await accountService.validateAccountData(req.body.role);
      if (!role) {
        return res.status(404).json({ message: "Role not found" });
      }
      next();
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
};

module.exports = accountController;
