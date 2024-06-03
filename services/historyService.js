const History = require("../models/history");
const Account = require("../models/account");
const Novel = require("../models/novel");

const historyService = {
  getHistories: async (accountId, page, pageSize, sortField, sortOrder) => {
    const skip = (page - 1) * pageSize;
    const filterObject = { account: accountId };

    const sortOptions = {};
    if (sortField) {
      sortOptions[sortField] = sortOrder;
    }

    const histories = await History.find(filterObject)
      .populate("novel")
      .sort(sortOptions) 
      .skip(skip)
      .limit(pageSize);

    const total = await History.countDocuments(filterObject);

    return {
      total: total,
      totalPages: Math.ceil(total / pageSize),
      currentPage: page,
      histories: histories,
    };
  },

  getHistory: async (id) => {
    const history = await History.findById(id).populate("novel");
    return history;
  },

  addHistory: async (historyData) => {
    const { account, novel, lastReadChapter, lastReadDate } = historyData;

    const accountExists = await Account.findById(account);
    const novelExists = await Novel.findById(novel);

    if (!accountExists || !novelExists) {
      throw new Error("Account or Novel not found");
    }

    const existingHistory = await History.findOne({ account, novel });
    if (existingHistory) {
      existingHistory.lastReadChapter = lastReadChapter;
      existingHistory.lastReadDate = lastReadDate || Date.now();
      const updatedHistory = await existingHistory.save();
      return updatedHistory;
    }

    const history = new History(historyData);
    const newHistory = await history.save();
    return newHistory;
  },

  updateHistory: async (id, historyData) => {
    const history = await History.findById(id);
    if (!history) {
      throw new Error("History not found");
    }

    Object.assign(history, historyData);
    const updatedHistory = await history.save();
    return updatedHistory;
  },

  deleteHistory: async (id) => {
    const history = await History.findById(id);
    if (!history) {
      throw new Error("History not found");
    }

    await History.findByIdAndDelete(id);
  },

  deleteHistoriesByAccount: async (accountId) => {
    const result = await History.deleteMany({ account: accountId });
    return result.deletedCount;
  },

  validateHistoryData: async (lastReadChapter) => {
    if (lastReadChapter < 1) {
      throw new Error("Last read chapter must be at least 1");
    }
  },
};

module.exports = historyService;
