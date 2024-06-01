const Author = require("../models/author");
const Category = require("../models/category");
const Novel = require("../models/novel");
const Account = require("../models/account");
const Comment = require("../models/comment");
const Role = require("../models/role");

const csvtojson = require("csvtojson");
const bcrypt = require("bcryptjs");

const importService = {
  importAccount: async () => {
    const accounts = await csvtojson().fromFile("account.csv");
    const roleCustomer = await Role.findOne({ name: "customer" });

    let importedCount = 0;

    await Promise.all(
      accounts.map(async (acc) => {
        const existingAccount = await Account.findById(acc.accountId);
        if (!existingAccount) {
          const hashedPassword = bcrypt.hashSync("test", 10);
          const accountData = {
            _id: acc.accountId,
            name: acc.accountName,
            username: acc.accountId,
            password: hashedPassword,
            email: `${acc.accountName}${acc.accountId}@gmail.com`,
            role: roleCustomer._id,
          };
          const newAccount = new Account(accountData);
          await newAccount.save();
          importedCount++;
        }
      })
    );

    return importedCount;
  },

  importNovel: async () => {
    const novels = await csvtojson().fromFile("novel.csv");

    let importedCount = 0;

    for (const nov of novels) {
      const existingNovel = await Novel.findById(nov.novelId);
      if (!existingNovel) {
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

        const chapters = parseInt(nov.chapters, 10);
        const views = parseInt(nov.views, 10);
        const powerStone = parseInt(nov.powerStone.replace(/,/g, ''), 10);

        if (isNaN(chapters) || isNaN(views) || isNaN(powerStone)) {
          console.error(`Invalid data for novel ${nov.novelId}:`, nov);
          continue;
        }

        const novelData = {
          _id: nov.novelId,
          name: nov.name,
          description: nov.description,
          chapters: chapters,
          views: views,
          powerStone: powerStone,
          imageUrl: nov.imageUrl,
          author: author ? author._id : null,
          category: category ? category._id : null,
          totalRating: 0,
          ratingCount: 0,
          averageRating: 0,
        };

        const newNovel = new Novel(novelData);
        await newNovel.save();
        importedCount++;
      }
    }

    return importedCount;
  },

  importComment: async () => {
    const comments = await csvtojson().fromFile("comment.csv");
    let importedCount = 0;

    await Promise.all(
      comments.map(async (com) => {
        if (!com.commentId || !com.content || !com.novelId || !com.accountId || !com.rating) {
          return;
        }

        const existingComment = await Comment.findById(com.commentId);
        if (!existingComment) {
          const novelExists = await Novel.exists({ _id: com.novelId });
          const accountExists = await Account.exists({ _id: com.accountId });

          if (!novelExists || !accountExists) {
            return;
          }

          const commentData = {
            _id: com.commentId,
            content: com.content,
            novel: com.novelId,
            account: com.accountId,
            rating: com.rating,
          };
          const comment = new Comment(commentData);
          await comment.save();

          importedCount++;
        }
      })
    );

    return importedCount;
  },
};

module.exports = importService;
