const axios = require("axios");
require("dotenv").config();

// Import or initialize your chatSession object as needed.
const { chatSession } = require("../utils/geminiAiModel"); // Adjust path accordingly

const getVideoRecommendations = async (req, res) => {
  try {
    const { userInterest } = req.body;

    // Build a prompt for Gemini to return 5 video recommendations in a specific format.
    // This prompt instructs Gemini to list recommendations with title and URL.
    const InputPrompt = `Provide 5 popular YouTube video recommendations about ${userInterest}. 
List them in the following format (one per line): "Title: <video title>, URL: <YouTube video URL>"`;

    // Get Gemini response via your chat session method.
    const result = await chatSession.sendMessage(InputPrompt);
    const geminiResponseText = result.response.text();
    console.log("Gemini response:", geminiResponseText);

    // Use regex to extract YouTube video URLs from the response.
    // This regex looks for URLs of the form: https://www.youtube.com/watch?v=<videoId>
    const youtubeUrlRegex = /https:\/\/www\.youtube\.com\/watch\?v=([\w-]+)/g;
    const videoIds = [];
    let match;
    while ((match = youtubeUrlRegex.exec(geminiResponseText)) !== null) {
      if (videoIds.length < 5) {
        videoIds.push(match[1]); // match[1] is the video id captured by the regex
      } else {
        break;
      }
    }

    if (videoIds.length === 0) {
      return res
        .status(400)
        .json({ message: "No video recommendations found." });
    }

    // Call YouTube Data API's videos endpoint to get details for the video IDs.
    // The endpoint URL is fixed.
    const youtubeVideosResponse = await axios.get(
      "https://www.googleapis.com/youtube/v3/videos",
      {
        params: {
          part: "snippet,statistics",
          id: videoIds.join(","),
          key: process.env.YOUTUBE_API_KEY,
        },
      }
    );

    const videos = youtubeVideosResponse.data.items;
    return res.status(200).json({ videos });
  } catch (error) {
    console.error("Error fetching video recommendations:", error.message);
    return res.status(500).json({
      message: "Error fetching video recommendations",
      error: error.message,
    });
  }
};

module.exports = {
  getVideoRecommendations,
};
