const novelService = require("../services/novelService");

const NovelController = {
  getNovels: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const sortField = req.query.sortField || null;
      const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
      const categoryId = req.query.categoryId || null;
      const authorId = req.query.authorId || null;
      const search = req.query.search || null;
      const ids = req.query.ids ? req.query.ids.split(",") : null; // assuming ids are passed as a comma-separated string

      const result = await novelService.getNovels(
        page,
        pageSize,
        sortField,
        sortOrder,
        categoryId,
        authorId,
        search,
        ids
      );
      res.json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  getNovel: async (req, res) => {
    try {
      const novel = await novelService.getNovel(req.params.id);
      if (!novel) {
        return res.status(404).json({ message: "Novel not found" });
      }
      res.json(novel);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  addNovel: async (req, res) => {
    try {
      const newNovel = await novelService.addNovel(req.body);
      res.status(200).json(newNovel);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  updateNovel: async (req, res) => {
    try {
      const updatedNovel = await novelService.updateNovel(
        req.params.id,
        req.body
      );
      res.status(200).json(updatedNovel);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  updateRatings: async (req, res) => {
    try {
      const novels = await novelService.updateRatings();
      res.status(200).json({ message: "Ratings updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteNovel: async (req, res) => {
    try {
      await novelService.deleteNovel(req.params.id);
      res.status(202).json({ message: "Novel has been deleted" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  validateNovelData: async (req, res, next) => {
    try {
      const { name, author, category } = req.body;
      const novelId = req.params.id;
      await novelService.validateNovelData(name, author, category, novelId);
      next();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = NovelController;
