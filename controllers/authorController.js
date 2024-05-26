const authorService = require("../services/authorService");

const AuthorController = {
  getAuthors: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const sortField = req.query.sortField || null;
      const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;

      const result = await authorService.getAuthors(
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

  getAuthor: async (req, res) => {
    try {
      const author = await authorService.getAuthor(req.params.id);
      if (!author) {
        return res.status(404).json({ message: "Author not found" });
      }

      res.status(200).json(author);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  addAuthor: async (req, res) => {
    try {
      const savedAuthor = await authorService.addAuthor(req.body);
      res.status(200).json(savedAuthor);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  updateAuthor: async (req, res) => {
    try {
      const updatedAuthor = await authorService.updateAuthor(
        req.params.id,
        req.body
      );
      if (!updatedAuthor) {
        return res.status(404).json({ message: "Author not found" });
      }
      res.status(200).json(updatedAuthor);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  deleteAuthor: async (req, res) => {
    try {
      const author = await authorService.getAuthor(req.params.id);
      if (!author) {
        return res.status(404).json({ message: "Author not found" });
      }
      await authorService.deleteAuthor(req.params.id);
      res.status(200).json({ message: "Author has been deleted" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  
  validateAuthorData: async (req, res, next) => {
    try {
      const { name } = req.body;
      const authorId = req.params.id;

      // Check if name is already taken by another author
      if (name) {
        const existingAuthor = await Author.findOne({ name });
        if (existingAuthor && existingAuthor._id.toString() !== authorId) {
          return res
            .status(400)
            .json({ message: "Author name already exists" });
        }
      }

      next();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = AuthorController;
