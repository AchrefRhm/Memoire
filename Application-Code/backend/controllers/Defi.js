const Challenge = require("../models/Challenge");
const { chatSession } = require("../utils/geminiAiModel");
const UserChallenge = require("../models/UserChallenge");
const Badge = require("../models/Badge");
const User = require("../models/User");
const { sendNotificationToUser, broadcastNotification } = require("../socket");

const assignBadges = async (req, res) => {
  try {
    console.log("Starting badge assignment...");
    const { job } = req.body;

    // Fetch all user challenges
    const usersInJob = await User.find({ job }).select("_id");
    const userIds = usersInJob.map((user) => user._id);
    const userChallenges = await UserChallenge.find({
      userId: { $in: userIds },
    });

    if (!userChallenges.length) {
      return;
    }

    // Group challenges by userId and calculate total scores
    const userScores = {};

    for (const challenge of userChallenges) {
      const userId = challenge.userId.toString(); // Convert ObjectId to string

      if (!userScores[userId]) {
        userScores[userId] = 0;
      }

      userScores[userId] += parseInt(challenge.score, 10) || 0; // Convert score to number
    }

    // Assign "50_points" badge
    for (const userId in userScores) {
      if (userScores[userId] >= 50) {
        const existingBadge = await Badge.findOne({
          userId,
          type: "50_points",
        });

        if (!existingBadge) {
          var badge = new Badge({ userId, type: "50_points" });
          await badge.save();
          sendNotificationToUser(userId, "newBadge", badge);
        }
      }
    }

    return res.json({ badge });
  } catch (error) {
    console.error("Error in assignBadges function:", error);
  }
};
const getBadgeById = async (req, res) => {
  try {
    const { id } = req.params;
    const badge = await Badge.findById(id);

    if (!badge) {
      return res.status(404).json({ message: "Badge not found" });
    }

    return res.json(badge);
  } catch (error) {
    console.error("Error in getBadgeById function:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const getBadgesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const badges = await Badge.find({ userId });

    if (!badges.length) {
      return res.status(404).json({ message: "No badges found for this user" });
    }

    return res.json(badges);
  } catch (error) {
    console.error("Error in getBadgesByUserId function:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const getTodayStart = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

const generateDailyChallenge = async (req, res) => {
  try {
    const { job, userId } = req.body;
    if (!job) {
      return res.status(400).json({ message: "Job is required" });
    }

    // Check if a challenge exists for today

    const todayStart = getTodayStart();
    let challenge = await Challenge.findOne({
      job,
      expiresAt: { $gte: new Date() },
    });
    if (!challenge) {
      // Generate a new challenge
      const prompt = `Génère un défi de 10 min d’entretien pour la poste ${job}. Donne une seule question en JSON avec le champ 'question'.`;
      const result = await chatSession.sendMessage(prompt);
      const responseJson = JSON.parse(
        result.response
          .text()
          .replace(/```json|```/g, "")
          .trim()
      );

      challenge = new Challenge({
        title: `Défi du ${todayStart.toLocaleDateString()}`,
        job,
        question: responseJson.question,
        expiresAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // Expires in 24 hours from now
      });

      await challenge.save();
      console.log(challenge);

      broadcastNotification("newChallenge", challenge);
    }
    const existingSubmission = await UserChallenge.findOne({
      userId,
      challengeId: challenge._id,
    });

    if (existingSubmission) {
      return res.json({
        message: "Défi du jour terminé, retournez demain",
        challenge: null,
      });
    }
    res.json({ challenge });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération du défi",
      error: error.message,
    });
  }
};

const submitChallengeAnswer = async (req, res) => {
  try {
    const { userId, challengeId, answer } = req.body;

    if (!userId || !challengeId) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    // If the answer is empty, set it to "no response"
    const userAnswer = answer.trim() === "" ? "no response" : answer;

    const challenge = await Challenge.findById(challengeId);

    if (!challenge) {
      return res.status(404).json({ message: "Défi non trouvé" });
    }

    const prompt = `Voici la réponse de l'utilisateur : ${userAnswer}, et voici la question: ${challenge.question}. Note cette réponse sur 10 (applique une notation stricte) ,solution (en 10 ligne max et retour a la ligne) et donne un feedback . tout en JSON avec 'score' et 'feedback' et 'solution'.`;
    const result = await chatSession.sendMessage(prompt);

    const rawResponse = result.response.text(); // Get the raw response
    console.log("Raw response:", rawResponse); // Log the raw response for debugging

    // Try to parse the response, and catch any errors
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(
        rawResponse.replace(/```json|```/g, "").trim()
      );
    } catch (error) {
      console.error("Error parsing response:", error);
      return res.status(500).json({
        message: "Erreur lors de l'enregistrement",
        error: "Invalid JSON format in response",
      });
    }

    // Ensure feedback is a string
    const feedback =
      typeof parsedResponse.feedback === "string"
        ? parsedResponse.feedback
        : JSON.stringify(parsedResponse.feedback); // Convert to string if it's not
    const solution =
      typeof parsedResponse.solution === "string"
        ? parsedResponse.solution
        : JSON.stringify(parsedResponse.solution); // Convert to string if it's not
    const userChallenge = new UserChallenge({
      userId,
      challengeId,
      answer: userAnswer, // Store the updated answer
      score: parsedResponse.score,
      feedback, // Ensure feedback is a string
      solution,
    });

    await userChallenge.save();

    res.status(200).json({ message: "Réponse enregistrée", userChallenge });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de l'enregistrement",
      error: error.message,
    });
  }
};

const getUserChallengeById = async (req, res) => {
  try {
    const { userChallengeId } = req.params;
    const { user_id } = req.body;
    // Vérifier si l'ID est fourni
    if (!userChallengeId) {
      return res
        .status(400)
        .json({ message: "L'ID du défi utilisateur est requis" });
    }

    // Trouver le UserChallenge et peupler le challenge associé
    const userChallenge = await UserChallenge.findOne({
      challengeId: userChallengeId,
      userId: user_id,
    }).populate("challengeId");

    if (!userChallenge) {
      return res.status(404).json({ message: "Défi utilisateur non trouvé" });
    }

    res.status(200).json({ userChallenge });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du défi utilisateur :",
      error
    );
    res.status(500).json({
      message: "Erreur lors de la récupération du défi utilisateur",
      error: error.message,
    });
  }
};

const findTodayChallenge = async (req, res) => {
  try {
    const { job } = req.body;

    // Ensure getTodayStart() returns the correct date for today's start
    const todayStart = getTodayStart();

    // Find the challenge for the provided job where expiration date is after today's start
    const challenge = await Challenge.findOne({
      job,
      expiresAt: { $gte: todayStart },
    });

    if (!challenge) {
      return res.status(404).json({ message: "No challenge found for today." });
    }

    // Return the found challenge
    return res.status(200).json(challenge);
  } catch (err) {
    // Handle any errors that occur during the process
    console.error(err);
    return res
      .status(500)
      .json({ error: "Server error while fetching the challenge." });
  }
};
const getUsersAnswersByChallengeId = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const { userId } = req.query; // Get userId from query params

    if (!challengeId) {
      return res.status(400).json({ message: "Challenge ID is required" });
    }

    const usersAnswers = await UserChallenge.find({
      challengeId,
      userId: { $ne: userId },
    }) // Exclude current user
      .populate("userId", "username img") // Populate user details
      .select("userId answer score"); // Select required fields

    if (!usersAnswers.length) {
      return res
        .status(404)
        .json({ message: "No answers found for this challenge" });
    }

    res.status(200).json(usersAnswers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user answers", error: error.message });
  }
};

const rankUsersByJob = async (req, res) => {
  try {
    const { job } = req.body;

    // Retrieve all users with the given job
    const users = await User.find({ job });

    // Retrieve all UserAnswers related to the users found
    const userAnswers = await UserChallenge.find({
      userId: { $in: users.map((user) => user._id) },
    });

    // Calculate the total score for each user
    const userScores = users.map((user) => {
      // Filter UserAnswers for the current user
      const userAnswersForUser = userAnswers.filter(
        (userAnswer) => userAnswer.userId.toString() === user._id.toString()
      );

      // Calculate the total score for the current user
      const totalScore = userAnswersForUser.reduce(
        (acc, userAnswer) => acc + Number(userAnswer.score),
        0
      );

      return {
        _id: user._id,
        username: user.username,
        img: user.img,
        totalScore,
      };
    });

    // Sort users by total score in descending order
    userScores.sort((a, b) => b.totalScore - a.totalScore);

    res.status(200).json(userScores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  assignBadges,
  submitChallengeAnswer,
  generateDailyChallenge,
  findTodayChallenge,
  getUserChallengeById,
  getUsersAnswersByChallengeId,
  rankUsersByJob,
  getBadgeById,
  getBadgesByUserId,
};
