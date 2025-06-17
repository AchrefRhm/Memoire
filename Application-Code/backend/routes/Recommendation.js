// routes/recommendationsRouter.js
const express = require("express");
const router = express.Router();
const { getVideoRecommendations } = require("../controllers/Recommendations");

// Route: GET /api/recommendations
router.post("/recommendations", getVideoRecommendations);

module.exports = router;
