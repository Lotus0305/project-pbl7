const Novel = require("../models/novel");
const Author = require("../models/author");
const Category = require("../models/category");

const novelService = {
  getNovels: async (page, pageSize, sortField, sortOrder, categoryId, authorId) => {
    const skip = (page - 1) * pageSize;
    let sortObject = {};
    if (sortField) {
      sortObject[sortField] = sortOrder === "desc" ? -1 : 1;
    }

    let filterObject = {};
    if (categoryId) {
      filterObject.category = categoryId;
    }
    if (authorId) {
      filterObject.author = authorId;
    }

    const novels = await Novel.find(filterObject)
      .populate("author", "_id name")
      .populate("category", "_id name")
      .skip(skip)
      .limit(pageSize)
      .sort(sortObject);
    const total = await Novel.countDocuments(filterObject);

    return {
      totalPages: Math.ceil(total / pageSize),
      currentPage: page,
      novels,
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

  validateNovelData: async (authorId, categoryId) => {
    const author = await Author.findById(authorId);
    if (!author) {
      throw new Error("Author not found");
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      throw new Error("Category not found");
    }
  },
};

module.exports = novelService;
