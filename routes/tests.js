const express = require("express");
const router = express.Router();
const {
  getAllTests,
  getTest,
  createTest,
  updateTest,
  deleteTest,
} = require("../controllers/tests");

router.route("/").post(createTest).get(getAllTests);
router.route("/:id").get(getTest).patch(updateTest).delete(deleteTest); // Needs a specific ID to function

module.exports = router;
