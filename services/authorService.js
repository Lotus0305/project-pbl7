const Author = require("../models/author");

const authorService = {
  getAuthors: async (page, pageSize, sortField, sortOrder) => {
    const skip = (page - 1) * pageSize;
    let sortObject = {};
    if (sortField) {
      sortObject[sortField] = sortOrder === 'desc' ? -1 : 1;
    }

    const authors = await Author.find()
      .skip(skip)
      .limit(pageSize)
      .sort(sortObject);

    const total = await Author.countDocuments();

    return {
      totalPages: Math.ceil(total / pageSize),
      currentPage: page,
      authors,
    };
  },

  getAuthor: async (id) => {
    const author = await Author.findById(id);
    return author;
  },

  addAuthor: async (authorData) => {
    const author = new Author(authorData);
    const savedAuthor = await author.save();
    return savedAuthor;
  },

  updateAuthor: async (id, authorData) => {
    const updatedAuthor = await Author.findByIdAndUpdate(
      id,
      { $set: authorData },
      { new: true }
    );
    return updatedAuthor;
  },

  deleteAuthor: async (id) => {
    await Author.findByIdAndDelete(id);
  },
};

module.exports = authorService;
