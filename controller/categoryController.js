const Category = require("../model/category");

const CategoryController = {
  getCategories: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const sortField = req.query.sortField || null;
      const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;

      const skip = (page - 1) * pageSize;
      let sortObject = {};
      if (sortField) {
        sortObject[sortField] = sortOrder;
      }

      const categories = await Category.find()
        .skip(skip)
        .limit(pageSize)
        .sort(sortObject);

      const total = await Category.countDocuments();

      res.json({
        totalPages: Math.ceil(total / pageSize),
        currentPage: page,
        categories,
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  getCategory: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.status(200).json(category);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  addCategory: async (req, res) => {
    try {
      const category = new Category(req.body);
      const saveCategory = await category.save();
      res.status(200).json(saveCategory);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  updateCategory: async (req, res) => {
    try {
      // Check if category exists
      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      // Update category
      const updateCategory = await Category.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updateCategory);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      await Category.findByIdAndDelete(req.params.id);
      res.status(202).json({ message: "Category has been deleted" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
};

module.exports = CategoryController;
