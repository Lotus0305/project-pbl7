const historyService = require("../services/historyService");

const HistoryController = {
  getHistories: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const sortField = req.query.sortField || null;
      const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;

      const result = await historyService.getHistories(
        req.params.accountId,
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

  getHistory: async (req, res) => {
    try {
      const history = await historyService.getHistory(req.params.id);
      if (!history) {
        return res.status(404).json({ message: "History not found" });
      }

      res.status(200).json(history);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  addHistory: async (req, res) => {
    try {
      const newHistory = await historyService.addHistory(req.body);
      res.status(200).json(newHistory);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  updateHistory: async (req, res) => {
    try {
      const updatedHistory = await historyService.updateHistory(
        req.params.id,
        req.body
      );
      res.status(200).json(updatedHistory);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  deleteHistory: async (req, res) => {
    try {
      await historyService.deleteHistory(req.params.id);
      res.status(200).json({ message: "History has been deleted" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  validateHistoryData: async (req, res, next) => {
    try {
      const { lastReadChapter } = req.body;
      await historyService.validateHistoryData(lastReadChapter);
      next();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = HistoryController;
