const Novel = require("../models/novel");
const Author = require("../models/author");
const Category = require("../models/category");
const { spawn } = require("child_process");

const novelService = {
  // Fetch novels with pagination, filtering, and sorting
  getNovels: async (
    page,
    pageSize,
    sortField,
    sortOrder,
    categoryId,
    authorId
  ) => {
    const skip = (page - 1) * pageSize;
    const filterObject = {};

    if (categoryId) {
      filterObject.category = categoryId;
    }
    if (authorId) {
      filterObject.author = authorId;
    }

    const novels = await Novel.find(filterObject)
      .populate("author", "_id name")
      .populate("category", "_id name");

    const nonEmptyNovels = novels.filter(
      (novel) =>
        novel[sortField] !== "" &&
        novel[sortField] !== null &&
        novel[sortField] !== undefined
    );
    const emptyNovels = novels.filter(
      (novel) =>
        novel[sortField] === "" ||
        novel[sortField] === null ||
        novel[sortField] === undefined
    );

    nonEmptyNovels.sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortOrder === -1 ? 1 : -1;
      if (a[sortField] > b[sortField]) return sortOrder === -1 ? -1 : 1;
      return 0;
    });

    const processedNovels = nonEmptyNovels.concat(emptyNovels);
    const paginatedNovels = processedNovels.slice(skip, skip + pageSize);
    const total = await Novel.countDocuments(filterObject);

    return {
      totalPages: Math.ceil(total / pageSize),
      currentPage: page,
      novels: paginatedNovels,
    };
  },

  // Fetch a single novel by ID
  getNovel: async (id) => {
    const novel = await Novel.findById(id)
      .populate("author", "_id name")
      .populate("category", "_id name");

    if (!novel) {
      throw new Error("Novel not found");
    }

    return novel;
  },

  // Add a new novel
  addNovel: async (novelData) => {
    const novel = new Novel(novelData);
    const newNovel = await novel.save();
    return newNovel;
  },

  // Update an existing novel by ID
  updateNovel: async (id, novelData) => {
    const novel = await Novel.findById(id);

    if (!novel) {
      throw new Error("Novel not found");
    }

    const updatedNovel = await Novel.findByIdAndUpdate(
      id,
      { $set: novelData },
      { new: true }
    );
    return updatedNovel;
  },

  // Delete a novel by ID
  deleteNovel: async (id) => {
    const novel = await Novel.findById(id);

    if (!novel) {
      throw new Error("Novel not found");
    }

    await Novel.findByIdAndDelete(id);
  },

  // Validate novel data before adding or updating
  validateNovelData: async (name, author, category, novelId) => {
    if (name) {
      const existingNovel = await Novel.findOne({ name });
      if (existingNovel && existingNovel._id.toString() !== novelId) {
        throw new Error("Novel name already exists");
      }
    }

    if (author) {
      const authorExists = await Author.findById(author);
      if (!authorExists) {
        throw new Error("Author does not exist");
      }
    }

    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        throw new Error("Category does not exist");
      }
    }
  },

  getRecommendations: async (accountId) => {
    return new Promise((resolve, reject) => {
      console.log(accountId);
      const process = spawn('python', [__dirname +'/recommend.py', accountId]);
      let dataToSend = "";
      process.stdout.on("data", (data) => {
        dataToSend += data.toString();
      });

      process.stderr.on("data", (data) => {
        console.error(`stderr: ${data.toString("utf8")}`);
      });

      process.on("close", (code) => {
        if (code === 0) {
          const matches = dataToSend.match(/\[.*\]/);
          if (matches) {
            resolve(JSON.parse(matches[0]));
          } else {
            reject(new Error("Failed to extract recommendations."));
          }
        } else {
          reject(new Error(`Python script exited with code ${code}`));
        }
      });
    });
  },
};

module.exports = novelService;
