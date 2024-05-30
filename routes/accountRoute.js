const router = require("express").Router();
const accountController = require("../controllers/accountController");

router.get("/", accountController.getAccounts);
router.get("/:id", accountController.getAccount);
router.post(
  "/",
  accountController.validateAccountData,
  accountController.addAccount
);
router.post("/:accountId/like/:novelId", accountController.likeNovel);
router.post("/:accountId/unlike/:novelId", accountController.unlikeNovel);
router.put(
  "/:id",
  accountController.validateAccountData,
  accountController.protectAccountData,
  accountController.updateAccount
);
router.delete("/:id", accountController.deleteAccount);

module.exports = router;
