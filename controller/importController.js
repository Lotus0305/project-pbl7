const Author = require("../model/author");
const Category = require("../model/category");
const Novel = require("../model/novel");
const Account = require("../model/account");
const Comment = require("../model/comment");
const Role = require("../model/role");

const csvtojson = require("csvtojson");
const bcrypt = require("bcryptjs");

const importController = {
  importAccount: async (req, res) => {
    try {
      const accounts = await csvtojson().fromFile("account.csv");
      const roleCustomer = await Role.findOne({ name: "customer" });

      let importedCount = 0;

      await Promise.all(
        accounts.map(async (acc) => {
          const hashedPassword = bcrypt.hashSync("test", 10);
          const accountData = {
            _id: acc.accountID,
            name: acc.accountName,
            username: acc.accountID,
            password: hashedPassword,
            email: `${acc.accountName}${acc.accountID}@gmail.com`,
            role: roleCustomer._id,
          };
          await Account.findOneAndUpdate({ _id: acc.accountID }, accountData, {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
          });
          importedCount++;
        })
      );

      res.status(200).send(`Accounts imported successfully: ${importedCount}`);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  importNovel: async (req, res) => {
    try {
      const novels = await csvtojson().fromFile("novel.csv");

      let importedCount = 0;

      for (const nov of novels) {
        let category = null;
        let author = null;

        if (nov.categoryName && nov.categoryName.trim()) {
          const categoryName = nov.categoryName.toLowerCase().trim();
          category = await Category.findOne({ name: categoryName });
          if (!category) {
            category = new Category({ name: categoryName });
            await category.save();
          }
        }

        if (nov.authorName && nov.authorName.trim()) {
          const authorName = nov.authorName.toLowerCase().trim();
          author = await Author.findOne({ name: authorName });
          if (!author) {
            author = new Author({ name: authorName });
            await author.save();
          }
        }

        const novelData = {
          _id: nov.novelId,
          name: nov.name,
          description: nov.description,
          chapters: nov.chapters,
          views: nov.views,
          rating: nov.rating,
          powerStone: nov.powerStone,
          imageUrl: nov.imageUrl,
          author: author ? author._id : null,
          category: category ? category._id : null,
        };

        await Novel.findOneAndUpdate({ _id: nov.novelId }, novelData, {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        });
        importedCount++;
      }

      res.status(200).send(`Novels imported successfully: ${importedCount}`);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  importComment: async (req, res) => {
    try {
      const comments = await csvtojson().fromFile("comment.csv");

      let importedCount = 0;

      await Promise.all(
        comments.map(async (com) => {
          if (!com.novelId || !com.accountID) {
            return;
          }
          const commentData = {
            _id: com._id,
            content: com.content,
            novel: com.novelId,
            account: com.accountID,
            rating: com.rating,
          };

          await Comment.findOneAndUpdate({ _id: com._id }, commentData, {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
          });
          importedCount++;
        })
      );

      res.status(200).send(`Comments imported successfully: ${importedCount}`);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = importController;
