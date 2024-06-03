const Author = require("../models/author");

const authorService = {
  getAuthors: async (page, pageSize, sortField, sortOrder, search, ids) => {
    const skip = (page - 1) * pageSize;
    const filterObject = {};

    if (search) {
      filterObject.$or = [
        { name: { $regex: search, $options: "i" } }, // case-insensitive search by name
        { _id: search }, // exact match search by _id
      ];
    }
    if (ids) {
      filterObject._id = { $in: ids };
    }

    const authors = await Author.find(filterObject);

    const nonEmptyAuthors = authors.filter(
      (author) =>
        author[sortField] !== "" &&
        author[sortField] !== null &&
        author[sortField] !== undefined
    );
    const emptyAuthors = authors.filter(
      (author) =>
        author[sortField] === "" ||
        author[sortField] === null ||
        author[sortField] === undefined
    );

    nonEmptyAuthors.sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortOrder === -1 ? 1 : -1;
      if (a[sortField] > b[sortField]) return sortOrder === -1 ? -1 : 1;
      return 0;
    });

    const processedAuthors = nonEmptyAuthors.concat(emptyAuthors);
    const paginatedAuthors = processedAuthors.slice(skip, skip + pageSize);
    const total = await Author.countDocuments(filterObject);

    return {
      total: total,
      totalPages: Math.ceil(total / pageSize),
      currentPage: page,
      authors: paginatedAuthors,
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

  validateAuthorData: async (authorId, { name }) => {
    // Check if name is already taken by another author
    if (name) {
      const existingAuthor = await Author.findOne({ name });
      if (existingAuthor && existingAuthor._id.toString() !== authorId) {
        throw new Error("Author name already exists");
      }
    }
  },
};

module.exports = authorService;
