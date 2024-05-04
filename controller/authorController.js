const Author = require("../model/author");

const AuthorController = {
  getAuthors: async (req, res) => {
    try {
      const authors = await Author.find();
      res.status(200).json(authors);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  getAuthor: async (req, res) => {
    try {
      const author = await Author.findById(req.params.id);
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
      const author = new Author(req.body);
      const saveAuthor = await author.save();
      res.status(200).json(saveAuthor);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  updateAuthor: async (req, res) => {
    try {
      const author = await Author.findById(req.params.id);
      if (!author) {
        return res.status(404).json({ message: "Author not found" });
      }

      const updateAuthor = await Author.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updateAuthor);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  deleteAuthor: async (req, res) => {
    try {
      const author = await Author.findById(req.params.id);
      if (!author) {
        return res.status(404).json({ message: "Author not found" });
      }
    
      await Author.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Author has been deleted" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
};

module.exports = AuthorController;
