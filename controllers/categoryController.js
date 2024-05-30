const categoryService = require("../services/categoryService");

const CategoryController = {
  getCategories: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const sortField = req.query.sortField || null;
      const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;

      const result = await categoryService.getCategories(
        page,
        pageSize,
        sortField,
        sortOrder
      );
      res.json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  getCategory: async (req, res) => {
    try {
      const category = await categoryService.getCategory(req.params.id);
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
      const savedCategory = await categoryService.addCategory(req.body);
      res.status(200).json(savedCategory);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  updateCategory: async (req, res) => {
    try {
      const updatedCategory = await categoryService.updateCategory(
        req.params.id,
        req.body
      );
      if (!updatedCategory) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.status(200).json(updatedCategory);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const category = await categoryService.getCategory(req.params.id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      await categoryService.deleteCategory(req.params.id);
      res.status(202).json({ message: "Category has been deleted" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  validateCategoryData: async (req, res, next) => {
    try {
      const { name } = req.body;
      const categoryId = req.params.id;
      await categoryService.validateCategoryData(name, categoryId);
      next();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = CategoryController;
