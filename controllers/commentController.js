const commentService = require("../services/commentService");

const commentController = {
  getComments: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const sortField = req.query.sortField || null;
      const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;

      const result = await commentService.getComments(
        page,
        pageSize,
        sortField,
        sortOrder
      );
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getComment: async (req, res) => {
    try {
      const comment = await commentService.getComment(req.params.id);
      if (!comment) {
        res.status(404).json({ message: "Comment not found" });
        return;
      }
      res.json(comment);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  addComment: async (req, res) => {
    try {
      const comment = await commentService.addComment(req.body);
      res.json(comment);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  updateComment: async (req, res) => {
    try {
      const comment = await commentService.updateComment(
        req.params.id,
        req.body
      );
      res.json(comment);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteComment: async (req, res) => {
    try {
      const comment = await commentService.deleteComment(req.params.id);
      res.json(comment);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  validateCommentData: async (req, res, next) => {
    try {
      const { content, rating } = req.body;

      // Check if content is not empty
      if (!content || content.length < 1) {
        return res.status(400).json({ message: "Content cannot be empty" });
      }

      // Check if rating is between 1 and 5
      if (rating < 1 || rating > 5) {
        return res
          .status(400)
          .json({ message: "Rating must be between 1 and 5" });
      }

      next();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = commentController;
