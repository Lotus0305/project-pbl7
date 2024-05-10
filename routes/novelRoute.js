const router = require("express").Router();
const novelController = require("../controller/novelController");

router.get("/", novelController.getNovels);
router.get("/:id", novelController.getNovel);
router.post("/", novelController.validateNovelData, novelController.addNovel);
router.put(
  "/:id",
  novelController.validateNovelData,
  novelController.updateNovel
);
router.delete("/:id", novelController.deleteNovel);

module.exports = router;