const  Category  = require("../model/category");

const CategoryController = {
  getCategories: async (req, res) => {
    try {
      const categories = await Category.find();
      res.status(200).json(categories);
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
      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

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
