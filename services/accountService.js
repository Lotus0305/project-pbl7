const Account = require("../models/account");
const Role = require("../models/role");
const Novel = require("../models/novel");
const bcrypt = require("bcryptjs");

const accountService = {
  getAccounts: async (page, pageSize, sortField, sortOrder) => {
    const skip = (page - 1) * pageSize;

    const accounts = await Account.find()
      .select("-password")
      .populate("role", "_id name");

    const nonEmptyAccounts = accounts.filter(
      (account) =>
        account[sortField] !== "" &&
        account[sortField] !== null &&
        account[sortField] !== undefined
    );
    const emptyAccounts = accounts.filter(
      (account) =>
        account[sortField] === "" ||
        account[sortField] === null ||
        account[sortField] === undefined
    );

    nonEmptyAccounts.sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortOrder === "desc" ? 1 : -1;
      if (a[sortField] > b[sortField]) return sortOrder === "desc" ? -1 : 1;
      return 0;
    });

    const processedAccounts = nonEmptyAccounts.concat(emptyAccounts);
    const paginatedAccounts = processedAccounts.slice(skip, skip + pageSize);
    const total = await Account.countDocuments();

    return {
      totalPages: Math.ceil(total / pageSize),
      currentPage: page,
      accounts: paginatedAccounts,
    };
  },

  getAccount: async (id) => {
    const account = await Account.findById(id)
      .select("-password")
      .populate("role", "_id name");
    return account;
  },

  addAccount: async (accountData) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(accountData.password, salt);
    const role = await Role.findOne({ name: accountData.role });
    const account = await Account.create({
      username: accountData.username,
      password: hash,
      name: accountData.name,
      email: accountData.email,
      role: role,
    });
    const accountRes = await Account.findById(account._id)
      .select("-password")
      .populate("role", "_id name");
    return accountRes;
  },

  updateAccount: async (id, accountData) => {
    const account = await Account.findByIdAndUpdate(
      id,
      { $set: accountData },
      { new: true }
    )
      .select("-password")
      .populate("role", "_id name");
    return account;
  },

  deleteAccount: async (id) => {
    await Account.findByIdAndDelete(id);
  },

  likeNovel: async (accountId, novelId) => {
    const account = await Account.findById(accountId);
    const novel = await Novel.findById(novelId);

    if (!account || !novel) {
      throw new Error("Account or Novel not found");
    }

    if (account.likedNovels.includes(novelId)) {
      throw new Error("Novel already liked");
    }

    account.likedNovels.push(novelId);
    await account.save();

    return account.likedNovels;
  },

  unlikeNovel: async (accountId, novelId) => {
    const account = await Account.findById(accountId);

    if (!account) {
      throw new Error("Account not found");
    }

    const novelIndex = account.likedNovels.indexOf(novelId);
    if (novelIndex === -1) {
      throw new Error("Novel not liked");
    }

    account.likedNovels.splice(novelIndex, 1);
    await account.save();

    return account.likedNovels;
  },

  validateAccountData: async (accountId, { username, email }) => {
    // Check if username is already taken by another account
    if (username) {
      const existingUsername = await Account.findOne({ username });
      if (existingUsername && existingUsername._id.toString() !== accountId) {
        throw new Error("Username already exists");
      }
    }

    // Check if email is already taken by another account
    if (email) {
      const existingEmail = await Account.findOne({ email });
      if (existingEmail && existingEmail._id.toString() !== accountId) {
        throw new Error("Email already exists");
      }
    }
  },
};

module.exports = accountService;
