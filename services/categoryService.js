const Category = require("../models/category");

const categoryService = {
  getCategories: async (page, pageSize, sortField, sortOrder) => {
    const skip = (page - 1) * pageSize;
    let sortObject = {};
    if (sortField) {
      sortObject[sortField] = sortOrder === "desc" ? -1 : 1;
    }

    const categories = await Category.find()
      .skip(skip)
      .limit(pageSize)
      .sort(sortObject);

    const total = await Category.countDocuments();

    return {
      totalPages: Math.ceil(total / pageSize),
      currentPage: page,
      categories,
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
};

module.exports = categoryService;
