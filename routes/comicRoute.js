const router = require("express").Router();
const comicController = require("../controller/comicController");
const middlewareController = require("../controller/middlewareController");

verifyToken = middlewareController.verifyToken;
checkPermission = middlewareController.checkPermission;

router.get("/", comicController.getComics);
router.get("/:id", comicController.getComic);
router.post("/", comicController.addComic);
router.put("/:id", comicController.updateComic);
router.delete(
  "/:id",
  verifyToken,
  checkPermission('delete:comic'),
  comicController.deleteComic
);

module.exports = router;
