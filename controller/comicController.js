const Comic = require("../model/comic");

const ComicController = {
  getComics: async (req, res) => {
    try {
      const comics = await Comic.find()
        .populate("author", "_id name")
        .populate("categories", "_id name");
      res.json(comics);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  getComic: async (req, res) => {
    try {
      const comic = await Comic.findById(req.params.id);
      if (!comic) {
        return res.status(404).json({ message: "Comic not found" });
      }
      comic = comic.populate("author", "_id name").populate("categories", "_id name");
      res.json(comic);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  addComic: async (req, res) => {
    try {
      const validateerr = await validateComicData(req, res);
      if (validateerr) {
        return validateerr;
      }
      const comic = new Comic(req.body);
      const newComic = await comic.save();
      if (newComic.author) {
        await Author.findByIdAndUpdate(newComic.author, {
          $push: { comics: newComic._id },
        });
      }
      if (newComic.categories.length > 0) {
        await Category.updateMany(
          { _id: { $in: newComic.categories } },
          { $push: { comics: newComic._id } }
        );
      }
      res.status(200).json(newComic);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  updateComic: async (req, res) => {
    try {
      const comic = await Comic.findById(req.params.id);
      if (!comic) {
        return res.status(404).json({ message: "Comic not found" });
      }
      const validateerr = await this.validateComicData(req, res);
      if (validateerr) {
        return validateerr;
      }

      const updatedComic = await Comic.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedComic);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  deleteComic: async (req, res) => {
    try {
      const comic = await Comic.findById(req.params.id);
      if (!comic) {
        return res.status(404).json({ message: "Comic not found" });
      }
      await Comic.findByIdAndDelete(req.params.id);
      res.status(202).json({ message: "Comic has been deleted" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async validateComicData(req, res) {
    const author = await Author.findById(req.body.author);
    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }
    const categories = await Category.find({
      _id: { $in: req.body.categories },
    });
    if (categories.length !== req.body.categories.length) {
      return res
        .status(404)
        .json({ message: "One or more categories not found" });
    }
    return null;
  },
};

module.exports = ComicController;
