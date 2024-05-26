const History = require("../models/history");
const Account = require("../models/account");
const Novel = require("../models/novel");

const historyService = {
  getHistories : async (accountId, page, pageSize, sortField, sortOrder) => {
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
