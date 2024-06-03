const Novel = require("../models/novel");
const Author = require("../models/author");
const Category = require("../models/category");
const Comment = require("../models/comment");

const novelService = {
  getNovels: async (
    page,
    pageSize,
    sortField,
    sortOrder,
    categoryId,
    authorId,
    search,
    ids
  ) => {
    const skip = (page - 1) * pageSize;
    const filterObject = {};

    if (categoryId) {
      filterObject.category = categoryId;
    }
    if (authorId) {
      filterObject.author = authorId;
    }
    if (search) {
      filterObject.$or = [
        { name: { $regex: search, $options: 'i' } }, // case-insensitive search by name
        { _id: search } // exact match search by _id
      ];
    }
    if (ids) {
      filterObject._id = { $in: ids };
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
      total: total,
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

  updateRatings: async () => {
    const novels = await Novel.find();
    for (const novel of novels) {
      const comments = await Comment.find({ novel: novel._id });
      let totalRating = 0;
      let ratingCount = 0;

      comments.forEach((comment) => {
        totalRating += comment.rating;
        ratingCount += 1;
      });

      novel.totalRating = totalRating;
      novel.ratingCount = ratingCount;
      novel.averageRating = ratingCount > 0 ? totalRating / ratingCount : 0;
      await novel.save();
    }
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
};

module.exports = novelService;
