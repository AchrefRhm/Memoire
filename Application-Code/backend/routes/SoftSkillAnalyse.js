const express = require("express");
const { analyzeData } = require("../controllers/SoftSkillAnalyze");

const router = express.Router();

router.post("/generate", analyzeData);

module.exports = router;
