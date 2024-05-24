const History = require("../models/history");
const Account = require("../models/account");
const Novel = require("../models/novel");

const historyService = {
  getHistories: async (accountId, page, pageSize, sortField, sortOrder) => {
    const skip = (page - 1) * pageSize;
    let sortObject = {};
    if (sortField) {
      sortObject[sortField] = sortOrder === 'desc' ? -1 : 1;
    }

    const histories = await History.find({ account: accountId })
      .skip(skip)
      .limit(pageSize)
      .sort(sortObject)
      .populate("novel");

    const total = await History.countDocuments({ account: accountId });

    return {
      totalPages: Math.ceil(total / pageSize),
      currentPage: page,
      histories,
    };
  },

  getHistory: async (id) => {
    const history = await History.findById(id).populate("novel");
    return history;
  },

  addHistory: async (historyData) => {
    const { account, novel } = historyData;

    // Kiểm tra account và novel có tồn tại không
    const accountExists = await Account.findById(account);
    const novelExists = await Novel.findById(novel);

    if (!accountExists || !novelExists) {
      throw new Error("Account or Novel not found");
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
};

module.exports = historyService;
