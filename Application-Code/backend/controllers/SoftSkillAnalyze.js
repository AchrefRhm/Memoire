const { chatSession } = require("../utils/geminiAiModel");
const AnalysisReport = require("../models/SpeechBodyAnalyze");

const analyzeData = async (req, res) => {
  try {
    const { transcription, poseData, userId } = req.body;

    const prompt = `
      You are an expert in speech and body language analysis.
      Analyze the following speech transcription and body posture data:
      
      **Speech Transcription:**
      "${transcription}"
      
      **Body Posture Data:**
      ${JSON.stringify(poseData, null, 2)}
      
      Provide an analysis of the speaker's emotions, confidence level, and any inconsistencies between speech and body language.
      Suggest improvements if needed. Respond in JSON format.
    `;

    let response = await chatSession.sendMessage(prompt);
    console.log("Raw Gemini API Response:", response);

    let responseText = response.response.text?.();
    console.log("Extracted Response Text:", responseText);

    if (!responseText) {
      return res.status(500).json({ message: "Empty response from AI" });
    }

    // Remove unwanted JSON formatting and parse
    let Response;
    try {
      Response = JSON.parse(responseText.replace(/```json|```/g, "").trim());
    } catch (parseError) {
      console.error("Error parsing AI response JSON:", parseError);
      return res.status(500).json({ message: "Invalid JSON response from AI" });
    }

    // Save the transformed data
    const newAnalysis = new AnalysisReport({
      userId,
      Response,
    });
    await newAnalysis.save();

    res.json(newAnalysis);
  } catch (error) {
    console.error("Error processing AI response:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  analyzeData,
};
