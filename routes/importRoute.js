const router = require("express").Router();
const importController = require("../controllers/importController");

router.post("/import-account", importController.importAccount);
router.post("/import-novel", importController.importNovel);
router.post("/import-comment", importController.importComment);

module.exports = router;