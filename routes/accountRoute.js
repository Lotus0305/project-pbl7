const router = require("express").Router();
const accountController = require("../controller/accountController");

/**
 * @swagger
 * /api/v1/account/:
 *   get:
 *     description: Get all accounts
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: pageSize
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *       - name: sortField
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *       - name: sortOrder
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Error
 *
 * /api/v1/account/{id}:
 *   get:
 *     description: Get an account by id
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Error
 *       404:
 *         description: Account not found
 *
 *   post:
 *     description: Add a new account
 *     parameters:
 *       - name: username
 *         in: body
 *         required: true
 *         schema:
 *           type: string
 *       - name: password
 *         in: body
 *         required: true
 *         schema:
 *           type: string
 *       - name: email
 *         in: body
 *         required: true
 *         schema:
 *           type: string
 *       - name: role
 *         in: body
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Error
 *
 *   put:
 *     description: Update an account
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Error
 *       404:
 *         description: Account not found
 *
 *   delete:
 *     description: Delete an account
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Error
 *       404:
 *         description: Account not found
 */
router.get("/", accountController.getAccounts);
router.get("/:id", accountController.getAccount);
router.post(
  "/",
  accountController.validateAccountData,
  accountController.addAccount
);
router.put(
  "/:id",
  accountController.validateAccountData,
  accountController.updateAccount
);
router.delete("/:id", accountController.deleteAccount);

module.exports = router;
