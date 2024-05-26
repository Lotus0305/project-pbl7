const router = require("express").Router();
const authorController = require("../controllers/authorController");

router.get("/", authorController.getAuthors);
router.get("/:id", authorController.getAuthor);
router.post(
  "/",
  authorController.validateAuthorData,
  authorController.addAuthor
);
router.put(
  "/:id",
  authorController.validateAuthorData,
  authorController.updateAuthor
);
router.delete("/:id", authorController.deleteAuthor);

module.exports = router;
