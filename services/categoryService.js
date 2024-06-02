const Category = require("../models/category");

const categoryService = {
  getCategories: async (page, pageSize, sortField, sortOrder) => {
    const skip = (page - 1) * pageSize;

    const categories = await Category.find();
    const nonEmptyCategories = categories.filter(
      (category) =>
        category[sortField] !== "" &&
        category[sortField] !== null &&
        category[sortField] !== undefined
    );
    const emptyCategories = categories.filter(
      (category) =>
        category[sortField] === "" ||
        category[sortField] === null ||
        category[sortField] === undefined
    );

    nonEmptyCategories.sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortOrder === -1 ? 1 : -1;
      if (a[sortField] > b[sortField]) return sortOrder === -1 ? -1 : 1;
      return 0;
    });

    const processedCategories = nonEmptyCategories.concat(emptyCategories);
    const paginatedCategories = processedCategories.slice(skip, skip + pageSize);
    const total = await Category.countDocuments();

    return {
      totalPages: Math.ceil(total / pageSize),
      currentPage: page,
      categories: paginatedCategories,
    };
  },

  getCategory: async (id) => {
    const category = await Category.findById(id);
    return category;
  },

  addCategory: async (categoryData) => {
    const category = new Category(categoryData);
    const savedCategory = await category.save();
    return savedCategory;
  },

  updateCategory: async (id, categoryData) => {
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { $set: categoryData },
      { new: true }
    );
    return updatedCategory;
  },

  deleteCategory: async (id) => {
    await Category.findByIdAndDelete(id);
  },

  validateCategoryData: async (name, categoryId) => {
    if (name) {
      const existingCategory = await Category.findOne({ name });
      if (existingCategory && existingCategory._id.toString() !== categoryId) {
        throw new Error("Category name already exists");
      }
    }
  },
};

module.exports = categoryService;
