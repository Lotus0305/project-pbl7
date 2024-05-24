const router = require("express").Router();
const importController = require("../controller/importController");

router.post("/import-account", importController.importAccount);
router.post("/import-novel", importController.importNovel);
router.post("/import-comment", importController.importComment);

module.exports = router;