const router = require("express").Router();
const comicController = require("../controller/comicController");

router.get("/", comicController.getComics);
router.get("/:id", comicController.getComic);
router.post("/", comicController.addComic);
router.put("/:id", comicController.updateComic);
router.delete("/:id", comicController.deleteComic);

module.exports = router;
