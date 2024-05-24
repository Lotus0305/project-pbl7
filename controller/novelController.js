const Novel = require("../model/novel");
const Author = require("../model/author");
const Category = require("../model/category");

const NovelController = {
  getNovels: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const sortField = req.query.sortField || null;
      const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
      const categoryId = req.query.categoryId || null;
      const authorId = req.query.authorId || null;
  
      const skip = (page - 1) * pageSize;
      let sortObject = {};
      if (sortField) {
        sortObject[sortField] = sortOrder;
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
  
      res.json({
        totalPages: Math.ceil(total / pageSize),
        currentPage: page,
        novels,
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  

  getNovel: async (req, res) => {
    try {
      const novel = await Novel.findById(req.params.id)
        .populate("author", "_id name")
        .populate("category", "_id name");
      if (!novel) {
        return res.status(404).json({ message: "Novel not found" });
      }
      res.json(novel);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  addNovel: async (req, res) => {
    try {
      //add
      const novel = new Novel(req.body);
      const newNovel = await novel.save();
      res.status(200).json(newNovel);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  updateNovel: async (req, res) => {
    try {
      //check id
      const novel = await Novel.findById(req.params.id);
      if (!novel) {
        return res.status(404).json({ message: "Novel not found" });
      }
      //update
      const updatedNovel = await Novel.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedNovel);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  deleteNovel: async (req, res) => {
    try {
      //check id
      const novel = await Novel.findById(req.params.id);
      if (!novel) {
        return res.status(404).json({ message: "Novel not found" });
      }
      // delete
      await Novel.findByIdAndDelete(req.params.id);
      res.status(202).json({ message: "Novel has been deleted" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // check id author
  // check id category
  validateNovelData: async (req, res, next) => {
    const author = await Author.findById(req.body.author);
    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    next();
  },
};

module.exports = NovelController;
