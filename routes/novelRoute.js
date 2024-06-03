const express = require('express');
const router = express.Router();
const novelController = require('../controllers/novelController');

router.get("/", novelController.getNovels);
router.get("/update-ratings", novelController.updateRatings);
router.get("/:id", novelController.getNovel);
router.post("/", novelController.validateNovelData, novelController.addNovel);
router.put("/:id", novelController.validateNovelData, novelController.updateNovel);
router.delete("/:id", novelController.deleteNovel);

module.exports = router;
