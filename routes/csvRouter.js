const router = require("express").Router();
const csvController = require("../controller/csvController");

router.post("/", csvController.importData);

module.exports = router;