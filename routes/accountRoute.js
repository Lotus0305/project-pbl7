const router = require("express").Router();
const accountController = require("../controller/accountController");

router.get("/", accountController.getAccounts);
router.post("/", accountController.addAccount);
router.put("/:id", accountController.updateAccount);
router.delete("/:id", accountController.deleteAccount);

module.exports = router;