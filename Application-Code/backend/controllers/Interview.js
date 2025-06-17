const Interview = require("../models/interviews");
const { chatSession } = require("../utils/geminiAiModel");
const User = require("../models/User");
const UserAnswer = require("../models/userAnswers");

const postToGemini = async (req, res) => {
  try {
    const { job, description, yearsOfExperience, user, interviewType } =
      req.body;

    if (!job || !description || !yearsOfExperience || !interviewType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    
// Find user and check subscription
const foundUser = await User.findById(user);
if (!foundUser) {
  return res.status(404).json({ message: "User not found" });
}

// Check daily interview limit
const today = new Date();
today.setHours(0, 0, 0, 0);

const interviewsToday = await Interview.countDocuments({
  user: user,
  createdAt: { $gte: today }
});

// Subscription limits configuration
const subscriptionLimits = {
  free: {
    maxInterviews: 1,
    upgradePlan: "premium",
    message: "Upgrade to Premium for 10 interviews/day or Ultimate for unlimited access"
  },
  premium: {
    maxInterviews: 10,
    upgradePlan: "ultimate",
    message: "Upgrade to Ultimate for unlimited interviews"
  },
  ultimate: {
    maxInterviews: Infinity
  }
};

const userLimit = subscriptionLimits[foundUser.subs] || subscriptionLimits.free;

if (interviewsToday >= userLimit.maxInterviews) {
  return res.status(403).json({
    message: `You've reached your daily limit (${userLimit.maxInterviews} interview${userLimit.maxInterviews !== 1 ? 's' : ''}/day)`,
    upgradeRequired: foundUser.subs !== "ultimate",
    upgradeInfo: {
      recommendedPlan: userLimit.upgradePlan,
      message: userLimit.message,
      currentPlan: foundUser.subs,
      limits: {
        free: 1,
        premium: 10,
        ultimate: "Unlimited"
      }
    }
  });
}
    // Different prompts for different interview types
    let InputPrompt;
    if (interviewType === "hr") {
      InputPrompt = `Generate 5 HR interview questions for a ${job} position with ${yearsOfExperience} years of experience. 
      Focus on behavioral, situational, and cultural fit questions. Job details: ${description}.
      Provide questions and sample answers in JSON format with 'question' and 'answer' fields.
      Format the response as a valid JSON array of objects, without any markdown or additional text.`;
    } else {
      InputPrompt = `Generate 5 technical interview questions for a ${job} position with ${yearsOfExperience} years of experience. 
      Technical requirements: ${description}. 
      Provide questions and sample answers in JSON format with 'question' and 'answer' fields.
      Format the response as a valid JSON array of objects, without any markdown or additional text.`;
    }

    const result = await chatSession.sendMessage(InputPrompt);
    const responseText = result.response.text();

    // Improved JSON parsing with better error handling
    let MockJsonResp;
    try {
      // First try parsing directly in case it's already pure JSON
      MockJsonResp = JSON.parse(responseText);
    } catch (e) {
      // If direct parse fails, try cleaning the response
      const cleanedResponse = responseText.replace(/```(json)?/g, "").trim();
      MockJsonResp = JSON.parse(cleanedResponse);
    }

    // Validate the parsed response structure
    if (
      !Array.isArray(MockJsonResp) ||
      !MockJsonResp.every(
        (item) =>
          typeof item === "object" &&
          item !== null &&
          "question" in item &&
          "answer" in item
      )
    ) {
      throw new Error("Invalid response format from Gemini API");
    }

    // Save interview in the database
    const newInterview = new Interview({
      job,
      description,
      yearsOfExperience,
      user,
      interviewType,
      createdBy: foundUser.email,
      questions: MockJsonResp,
    });

    await newInterview.save();

    res.status(201).json({
      message: "Interview saved successfully",
      interview: newInterview,
    });
  } catch (error) {
    console.error("Error in postToGemini:", error);
    res.status(500).json({
      message: "Error posting to Gemini API",
      error: error.message,
    });
  }
};

// Updated feedback function to handle HR questions differently
const saveFeedback = async (req, res) => {
  try {
    const { interviewId, question, correctAns, userAns, userEmail } = req.body;

    if (!interviewId || !question || !correctAns) {
      return res
        .status(400)
        .json({ message: "interviewId, question, correctAns are required" });
    }

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    // Different feedback prompts based on interview type
    let InputPrompt;
    if (interview.interviewType === "hr") {
      InputPrompt = `{
        "question": "${question || ""}",
        "userAnswer": "${userAns || ""}",
        "instruction": "This is an HR interview question. Provide a JSON response with: 'rating' (1-10 based on answer quality), 'feedback' (3-5 lines focusing on communication skills, behavioral aspects, and cultural fit), and 'improvementTips' (specific suggestions)."
      }`;
    } else {
      InputPrompt = `{
        "question": "${question || ""}",
        "userAnswer": "${userAns || ""}",
        "instruction": "This is a technical interview question. Provide a JSON response with: 'rating' (1-10 based on technical accuracy), 'feedback' (3-5 lines technical evaluation), and 'improvementTips' (specific technical suggestions)."
      }`;
    }

    const result = await chatSession.sendMessage(InputPrompt);
    const rawText = result.response.text();

    const parsedResponse = JSON.parse(
      rawText.replace(/```json|```/g, "").trim()
    );
    const { rating, feedback, improvementTips } = parsedResponse;

    const newUserAnswer = new UserAnswer({
      interviewId,
      question,
      correctAns,
      userAns,
      rating,
      feedback,
      improvementTips,
      userEmail,

      interviewType: interview.interviewType, // Store interview type for reference
    });

    await newUserAnswer.save();

    res.status(200).json({
      message: "Feedback saved successfully",
      userAnswer: newUserAnswer,
    });
  } catch (error) {
    console.error("Error saving feedback:", error);
    res.status(500).json({
      message: "Error saving feedback",
      error: error.message,
    });
  }
};

// Get interview by ID (unchanged)
const getInterviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const interview = await Interview.findById(id);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    res.status(200).json(interview);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving interview",
      error: error.message,
    });
  }
};

// Get user answers by interview ID (unchanged)
const getUserAnswersByInterviewId = async (req, res) => {
  try {
    const { interviewId } = req.params;

    if (!interviewId) {
      return res.status(400).json({ message: "interviewId is required" });
    }

    const userAnswers = await UserAnswer.find({ interviewId });

    res.status(200).json({
      message: "User answers fetched successfully",
      userAnswers,
    });
  } catch (error) {
    console.error("Error fetching user answers:", error);
    res.status(500).json({
      message: "Error fetching user answers",
      error: error.message,
    });
  }
};

// Get interviews by user ID (updated to include interviewType)
const getInterviewsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const interviews = await Interview.find({ user: userId });

    res.status(200).json({
      message: "Interviews fetched successfully",
      interviews,
    });
  } catch (error) {
    console.error("Error fetching interviews:", error);
    res.status(500).json({
      message: "Error fetching interviews",
      error: error.message,
    });
  }
};

module.exports = {
  postToGemini,
  getInterviewById,
  saveFeedback,
  getUserAnswersByInterviewId,
  getInterviewsByUserId,
};
