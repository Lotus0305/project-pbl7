const Author = require("../model/author");
const Category = require("../model/category");
const Novel = require("../model/novel");
const Account = require("../model/account");
const Comment = require("../model/comment");
const Role = require("../model/role");

const csvtojson = require("csvtojson");
const bcrypt = require("bcryptjs");

const csvController = {
  importData: async (req, res) => {
    try {
      let novels = await csvtojson().fromFile("novel.csv");
      let comments = await csvtojson().fromFile("comment.csv");

      for (let n of novels) {
        let author = await Author.findOne({ name: n.authorName });
        if (!author) {
          author = new Author({
            name: n.authorName,
          });
          await author.save();
        }

        let category = await Category.findOne({ name: n.categoryName });
        if (!category) {
          category = new Category({
            name: n.categoryName,
          });
          await category.save();
        }

        let novel = await Novel.findOne({ _id: n.id });
        if (!novel) {
          novel = new Novel({
            _id: n.id,
            name: n.name,
            description: n.description,
            chapters: n.chapters,
            views: n.views,
            rating: n.rating,
            powerStone: n.powerStone,
            imageUrl: n.imageUrl,
            category: category._id,
            author: author._id,
          });
          await novel.save();
        }
      }

      for (let c of comments) {
        let account = await Account.findOne({ _id: c.accountId });
        let roleCustomer = await Role.findOne({ name: "customer" });
        if (!account) {
          account = new Account({
            _id: c.accountId,
            username: c.accountId,
            password: bcrypt.hashSync("test", 10),
            name: c.accountName,
            email: c.accountName + "@gmail.com",
            role: roleCustomer,
          });
          await account.save();
        }

        let novel = await Novel.findOne({ _id: c.novelId });
        if (novel) {
          let comment = new Comment({
            novel: novel.id,
            account: account._id,
            content: c.content ? c.content : "No content",
            rating: c.rating,
          });
          await comment.save();
        }
      }

      res.status(200).send("Data imported successfully");
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while importing data");
    }
  },
};

module.exports = csvController;
