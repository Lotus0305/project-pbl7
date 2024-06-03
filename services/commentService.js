const Comment = require("../models/comment");
const Novel = require("../models/novel");

const commentService = {
  getComments: async (page, pageSize, sortField, sortOrder, novelId, accountId) => {
    const skip = (page - 1) * pageSize;
    const filterObject = {};
    if (novelId) {
      filterObject.novel = novelId;
    }
    if (accountId) {
      filterObject.account = accountId;
    }

    const comments = await Comment.find(filterObject)
      .populate("novel", "_id name")
      .populate("account", "_id username");

    const nonEmptyComments = comments.filter(
      (comment) =>
        comment[sortField] !== "" &&
        comment[sortField] !== null &&
        comment[sortField] !== undefined
    );
    const emptyComments = comments.filter(
      (comment) =>
        comment[sortField] === "" ||
        comment[sortField] === null ||
        comment[sortField] === undefined
    );

    nonEmptyComments.sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortOrder === -1 ? 1 : -1;
      if (a[sortField] > b[sortField]) return sortOrder === -1 ? -1 : 1;
      return 0;
    });

    const processedComments = nonEmptyComments.concat(emptyComments);
    const paginatedComments = processedComments.slice(skip, skip + pageSize);
    const total = await Comment.countDocuments(filterObject);

    return {
      total: total,
      totalPages: Math.ceil(total / pageSize),
      currentPage: page,
      comments: paginatedComments,
    };
  },

  getComment: async (id) => {
    return await Comment.findById(id)
      .populate("novel", "_id name")
      .populate("account", "_id username");
  },

  addComment: async (commentData) => {
    const { account, novel } = commentData;
    const existingComment = await Comment.findOne({ account, novel });

    if (existingComment) {
      throw new Error("This account has already commented on this novel");
    }
    const existingNovel = await Novel.findOne({ _id: novel });
    if (!existingNovel) {
      throw new Error("The novel does not exist");
    }
    const comment = new Comment(commentData);
    return await comment.save();
  },

  updateComment: async (id, commentData) => {
    return await Comment.findByIdAndUpdate(id, commentData, { new: true });
  },

  deleteComment: async (id) => {
    return await Comment.findByIdAndDelete(id);
  },

  validateCommentData: async (content, rating) => {
    if (!content || content.length < 1) {
      throw new Error("Content cannot be empty");
    }

    if (rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }
  },
};

module.exports = commentService;
