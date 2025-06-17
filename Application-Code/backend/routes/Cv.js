const express = require("express");
const {
  generateCV,
  getAllCvs,
  getSpecificCv,
  createNewCv,
  updateCv,
  deleteCv,
  generateSummary,
  generateExperience,
} = require("../controllers/Cv");

const router = express.Router();

router.post("/generate", generateCV);
router.get("/:id", getAllCvs);
router.get("/detail/:id", getSpecificCv);
router.post("/create", createNewCv);
router.post("/generate-summary", generateSummary);
router.post("/generate-experience", generateExperience);
router.put("/:id", updateCv);
router.delete("/:id", deleteCv);
module.exports = router;
