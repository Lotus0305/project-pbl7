const Comment = require("../model/comment");
const Account = require("../model/account");
const Novel = require("../model/novel");

const commentController = {
  getComments: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const sortField = req.query.sortField || null;
      const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;

      const skip = (page - 1) * pageSize;
      let sortObject = {};
      if (sortField) {
        sortObject[sortField] = sortOrder;
      }

      const comments = await Comment.find()
        .skip(skip)
        .limit(pageSize)
        .sort(sortObject)
        .populate("account", "_id name")
        .populate("novel", "_id name");

      const total = await Comment.countDocuments();

      res.json({
        totalPages: Math.ceil(total / pageSize),
        currentPage: page,
        comments,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getComment: async (req, res) => {
    try {
      let comment = await Comment.findOne({ _id: req.params.id })
        .populate("account", "_id name")
        .populate("novel", "_id name");
      if (!comment) {
        res.status(404).json({ message: "Comment not found" });
        return;
      }
      res.json(comment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  addComment: async (req, res) => {
    try {
      let comment = new Comment({
        _id: req.body._id,
        content: req.body.content,
        account: req.body.accountId,
        novel: req.body.novelId,
        rating: req.body.rating,
      });
      await comment.save();
      res.json(comment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateComment: async (req, res) => {
    try {
      let comment = await Comment.findOne({ _id: req.params.id });
      if (!comment) {
        res.status(404).json({ message: "Comment not found" });
        return;
      }
      Object.assign(comment, req.body);
      await comment.save();
      res.json(comment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteComment: async (req, res) => {
    try {
      let comment = await Comment.findOne({ _id: req.params.id });
      if (!comment) {
        res.status(404).json({ message: "Comment not found" });
        return;
      }
      await comment.remove();
      res.json(comment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // check id account
  // check id novel
  validateCommentData: async (req, res, next) => {
    const account = await Account.findById(req.body.accountId);
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    const novel = await Novel.findById(req.body.novelId);
    if (!novel) {
      return res.status(404).json({ message: "Novel not found" });
    }

    next();
  },
};

module.exports = commentController;
