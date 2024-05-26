const router = require("express").Router();
const categoryController = require("../controllers/categoryController");

router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategory);
router.post(
  "/",
  categoryController.validateCategoryData,
  categoryController.addCategory
);
router.put(
  "/:id",
  categoryController.validateCategoryData,
  categoryController.updateCategory
);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
