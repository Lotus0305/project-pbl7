const router = require("express").Router();
const historyController = require("../controllers/historyController");

router.get("/:accountId", historyController.getHistories);
router.get("/detail/:id", historyController.getHistory);
router.post(
  "/",
  historyController.validateHistoryData,
  historyController.addHistory
);
router.put(
  "/:id",
  historyController.validateHistoryData,
  historyController.updateHistory
);
router.delete("/:id", historyController.deleteHistory);

module.exports = router;
