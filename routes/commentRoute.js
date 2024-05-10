const router = require("express").Router();
const commentController = require("../controller/commentController");

router.get("/", commentController.getComments);
router.get("/:id", commentController.getComment);
router.post(
  "/",
  commentController.validateCommentData,
  commentController.addComment
);
router.put(
  "/:id",
  commentController.validateCommentData,
  commentController.updateComment
);
router.delete("/:id", commentController.deleteComment);

module.exports = router;
