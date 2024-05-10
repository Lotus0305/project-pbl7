const router = require("express").Router();
const novelController = require("../controller/novelController");

/**
 * @swagger
 * /api/v1/novel/:
 *   get:
 *     description: Get all novels
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
 * /api/v1/novel/{id}:
 *   get:
 *     description: Get a novel by id
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
 *         description: Novel not found
 *
 *   post:
 *     description: Add a new novel
 *     parameters:
 *       - name: title
 *         in: body
 *         required: true
 *         schema:
 *           type: string
 *       - name: author
 *         in: body
 *         required: true
 *         schema:
 *           type: string
 *       - name: category
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
 *     description: Update a novel
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
 *         description: Novel not found
 *
 *   delete:
 *     description: Delete a novel
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
 *         description: Novel not found
 */
router.get("/", novelController.getNovels);
router.get("/:id", novelController.getNovel);
router.post("/", novelController.validateNovelData, novelController.addNovel);
router.put(
  "/:id",
  novelController.validateNovelData,
  novelController.updateNovel
);
router.delete("/:id", novelController.deleteNovel);

module.exports = router;
