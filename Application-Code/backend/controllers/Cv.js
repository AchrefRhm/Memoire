const { chatSession } = require("../utils/geminiAiModel");
const CV = require("../models/CV");
const User = require("../models/User");
const structure = {
  name: "string",
  contact_info: {
    email: "string",
    phone: "string",
    location: "string",
    linkedin: "string",
    portfolio: "string",
  },
  summary: "string",
  skills: {
    programming_languages: ["string"],
    frameworks_libraries: ["string"],
    tools: ["string"],
    other: ["string"],
  },
  experience: [
    {
      job_title: "string",
      company: "string",
      location: "string",
      start_date: "string",
      end_date: "string",
      responsibilities: ["string"],
    },
  ],
  education: [
    {
      degree: "string",
      institution: "string",
      location: "string",
    },
  ],
  languages: {
    English: "string",
    French: "string",
    Arabic: "string",
  },
};
//Ats cv
const generateCV = async (req, res) => {
  try {
    const { cv, jobDescription } = req.body;

    console.log("Received CV:", cv);
    console.log("Received Job Description:", jobDescription);
    const prompt = `You are an expert resume formatter. Here is my resume: ${JSON.stringify(
      cv
    )}. Here is the job description: ${jobDescription}. Generate a JSON-formatted resume tailored to this job. Adjust experiences and responsibilities to fit the job description without removing any experience. The output should be a valid JSON object following this structure: ${JSON.stringify(
      structure
    )}. Ensure it is a structured JSON, not a string. If a field is missing in the CV, leave it empty instead of removing it.`;

    let response = await chatSession.sendMessage(prompt);
    let responseText = response.response.text?.();
    responseText = responseText.replace(/```json|```/g, "").trim();
    res.json(JSON.parse(responseText));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllCvs = async (req, res) => {
  try {
    const cv = await CV.find({ userId: req.params.id });
    if (!cv) return res.status(404).json({ message: "CV not found" });
    res.json(cv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getSpecificCv = async (req, res) => {
  try {
    const cv = await CV.findById(req.params.id);
    if (!cv) return res.status(404).json({ message: "CV not found" });
    res.json(cv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createNewCv = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check daily CV generation limit
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const cvsToday = await CV.countDocuments({
      userId: userId,
      createdAt: { $gte: today },
    });

    // Determine limits based on subscription
    let maxCvs;
    switch (user.subs) {
      case "free":
        maxCvs = 1;
        break;
      case "premium":
        maxCvs = 10;
        break;
      case "ultimate":
        maxCvs = Infinity;
        break;
      default:
        maxCvs = 0;
    }

    if (cvsToday >= maxCvs) {
      return res.status(403).json({
        message: `Daily CV generation limit reached (${maxCvs} per day). Upgrade for more.`,
        upgradeRequired: true,
        currentPlan: user.subs,
        recommendedPlan: user.subs === "free" ? "premium" : "ultimate",
        limits: {
          free: 1,
          premium: 10,
          ultimate: "Unlimited",
        },
      });
    } else {
      // Create new CV if under limit
      const newCV = new CV({
        ...req.body,
        user: userId, // Make sure this matches your schema
        updatedAt: Date.now(),
      });
      const savedCV = await newCV.save();

      return res.status(201).json({
        message: "CV created successfully",
        cv: savedCV,
        usageStats: {
          remainingToday: maxCvs - cvsToday - 1,
          usedToday: cvsToday + 1,
          dailyLimit: maxCvs,
          currentPlan: user.subs,
        },
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateCv = async (req, res) => {
  try {
    const updatedCV = await CV.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!updatedCV) return res.status(404).json({ message: "CV not found" });
    res.json(updatedCV);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const deleteCv = async (req, res) => {
  try {
    const deletedCV = await CV.findByIdAndDelete(req.params.id);
    if (!deletedCV) return res.status(404).json({ message: "CV not found" });
    res.json({ message: "CV deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const generateSummary = async (req, res) => {
  try {
    const { personalInfo, experience, education, skills } = req.body;

    // Format CV data for the prompt
    const prompt = `
      Please generate a professional, concise summary for a CV with the following information:
      
      Personal Information:
      - Name: ${personalInfo.name}
      - Title: ${personalInfo.title}
      - Location: ${personalInfo.location}
      
      Experience:
      ${experience.map((exp) => `- ${exp.title} at ${exp.company}`).join("\n")}
      
      Education:
      ${education
        .map((edu) => `- ${edu.degree} in ${edu.field} from ${edu.institution}`)
        .join("\n")}
      
      Skills:
      ${skills.map((skill) => `- ${skill.name}`).join("\n")}
      
      The summary should be 3-4 sentences long, professional, and highlight key strengths and experiences.
      Return the summary as plain text.
    `;

    const result = await chatSession.sendMessage(prompt);
    const summaryText = result.response.text().trim();

    res.json({
      success: true,
      summary: summaryText,
    });
  } catch (error) {
    console.error("AI summary generation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate summary",
      error: error.message,
    });
  }
};

const generateExperience = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Customize this prompt to get the exact format you want
    const fullPrompt = `
      Convert the following work experience information into a structured JSON format. 
      The input is: "${prompt}"
      
      Return ONLY the JSON object in this exact format:
      {
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        description: ""
      }
      
      develop the description to be in 3 lines and it should be attractive for recruiters . Fill in the fields based on the information provided. If some information is missing, leave those fields empty.return in json format
    `;

    const result = await chatSession.sendMessage(fullPrompt);
    const summaryText = result.response.text().trim();

    res.json({
      success: true,
      summary: summaryText,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to process experience" });
  }
};

module.exports = {
  generateCV,
  getAllCvs,
  getSpecificCv,
  deleteCv,
  updateCv,
  createNewCv,
  generateSummary,
  generateExperience,
};
