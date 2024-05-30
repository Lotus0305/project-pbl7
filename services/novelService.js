const Novel = require("../models/novel");
const Author = require("../models/author");
const Category = require("../models/category");

const novelService = {
  getNovels: async (page, pageSize, sortField, sortOrder, categoryId, authorId) => {
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
      if (a[sortField] < b[sortField]) return sortOrder === "desc" ? 1 : -1;
      if (a[sortField] > b[sortField]) return sortOrder === "desc" ? -1 : 1;
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

  getNovel: async (id) => {
    const novel = await Novel.findById(id)
      .populate("author", "_id name")
      .populate("category", "_id name");
    return novel;
  },

  addNovel: async (novelData) => {
    const novel = new Novel(novelData);
    const newNovel = await novel.save();
    return newNovel;
  },

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

  deleteNovel: async (id) => {
    const novel = await Novel.findById(id);
    if (!novel) {
      throw new Error("Novel not found");
    }

    await Novel.findByIdAndDelete(id);
  },

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
};

module.exports = novelService;
