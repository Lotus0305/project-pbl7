const History = require("../models/history");
const Account = require("../models/account");
const Novel = require("../models/novel");

const historyService = {
  getHistories: async (accountId, page, pageSize, sortField, sortOrder) => {
    const skip = (page - 1) * pageSize;
    const filterObject = { account: accountId };

    const histories = await History.find(filterObject).populate("novel");

    const nonEmptyHistories = histories.filter(
      (history) =>
        history[sortField] !== "" &&
        history[sortField] !== null &&
        history[sortField] !== undefined
    );
    const emptyHistories = histories.filter(
      (history) =>
        history[sortField] === "" ||
        history[sortField] === null ||
        history[sortField] === undefined
    );

    nonEmptyHistories.sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortOrder === "desc" ? 1 : -1;
      if (a[sortField] > b[sortField]) return sortOrder === "desc" ? -1 : 1;
      return 0;
    });

    const processedHistories = nonEmptyHistories.concat(emptyHistories);
    const paginatedHistories = processedHistories.slice(skip, skip + pageSize);
    const total = await History.countDocuments(filterObject);

    return {
      totalPages: Math.ceil(total / pageSize),
      currentPage: page,
      histories: paginatedHistories,
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
