const { chatSession } = require("../utils/geminiAiModel");
const Quiz = require("../models/Quiz");
const QuizAnswer = require("../models/userQuizAnswer");
const generateQuiz = async (req, res) => {
  try {
    const { topic, difficulty, questionCount, questionType, user } = req.body;

    const prompt = `Create a multiple-choice quiz on "${topic}" with ${questionCount} questions. 
          Each question should have 4 options with ${questionType} answer and ${difficulty} difficulty. 
          Return JSON format like:
          [
            { "question": "What is X?", "options": ["A", "B", "C", "D"], "correctAnswer": "A" }
          ]`;

    const result = await chatSession.sendMessage(prompt);

    let responseText = result.response.text?.();
    if (!responseText) {
      throw new Error("Invalid response from AI model");
    }

    // Ensure the response is a valid JSON string
    responseText = responseText.replace(/```json|```/g, "").trim();

    let quizData;
    try {
      quizData = JSON.parse(responseText);
    } catch (error) {
      throw new Error("AI response is not valid JSON");
    }

    // Validate and format the questions correctly
    if (!Array.isArray(quizData) || quizData.length === 0) {
      throw new Error("AI response does not contain a valid quiz format");
    }

    const formattedQuestions = quizData.map((q) => ({
      question: q.question || "No question provided",
      options: Array.isArray(q.options) ? q.options : [],
      correctAnswer: q.correctAnswer || "",
      type: questionType,
      difficulty: difficulty,
    }));

    // Ensure all options are properly formatted as an array of strings
    if (
      formattedQuestions.some(
        (q) => !Array.isArray(q.options) || q.options.length !== 4
      )
    ) {
      throw new Error("One or more questions have an invalid options format");
    }

    const newQuiz = new Quiz({
      user,
      topic,
      difficulty,
      questionCount,
      questionType,
      questions: formattedQuestions,
    });

    await newQuiz.save();

    res.json(newQuiz);
  } catch (error) {
    console.error("Quiz Generation Error:", error.message);
    res.status(500).json({ error: error.message || "Failed to generate quiz" });
  }
};

// Get all quizzes by user ID (from request body)
const getQuizzesByUserId = async (req, res) => {
  try {
    const { user } = req.body;

    if (!user) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const quizzes = await Quiz.find({ user });

    if (!quizzes.length) {
      return res
        .status(404)
        .json({ message: "No quizzes found for this user" });
    }

    res.status(200).json({ quizzes });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
const getQuizById = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch quiz" });
  }
};

// const submitQuiz = async (req, res) => {
//   try {
//     const { user, quizId, answers } = req.body;

//     // Find the quiz
//     const quiz = await Quiz.findById(quizId);
//     if (!quiz) {
//       return res.status(404).json({ error: "Quiz not found" });
//     }

//     // Validate if the user's answers match the correct answers
//     const processedAnswers = answers.map((answer, index) => {
//       const correctAnswer = quiz.questions[index]?.correctAnswer;
//       return {
//         question: quiz.questions[index]?.question || "",
//         selectedOption: answer.selectedOption,
//         isCorrect: correctAnswer.includes(answer.selectedOption),
//       };
//     });

//     // Calculate the score
//     const score = processedAnswers.filter((a) => a.isCorrect).length;

//     // Save the user's answers
//     const newQuizAnswer = new QuizAnswer({
//       user,
//       quiz: quizId,
//       answers: processedAnswers,
//       score,
//     });

//     await newQuizAnswer.save();

//     res.status(201).json({ message: "Quiz submitted successfully", score });
//   } catch (error) {
//     console.error("Quiz Submission Error:", error.message);
//     res.status(500).json({ error: "Failed to submit quiz" });
//   }
// };

const getQuizAnswerById = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await QuizAnswer.find({ quiz: id });

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch quiz" });
  }
};

const submitQuiz = async (req, res) => {
  try {
    const { user, quizId, answers } = req.body;

    // Find the quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    // Validate user's answers against correct answers
    const processedAnswers = answers.map((answer, index) => {
      const correctAnswer = quiz.questions[index]?.correctAnswer || [];

      // Ensure correctAnswer is an array
      const correctAnswersArray = Array.isArray(correctAnswer)
        ? correctAnswer
        : [correctAnswer];

      // Ensure user's selected options is always an array
      const userSelectedOptions = Array.isArray(answer.selectedOption)
        ? answer.selectedOption
        : [answer.selectedOption];

      // Check if selected options match the correct answers
      const isCorrect =
        userSelectedOptions.length === correctAnswersArray.length &&
        userSelectedOptions.every((opt) => correctAnswersArray.includes(opt));

      return {
        question: quiz.questions[index]?.question || "",
        selectedOption: userSelectedOptions,
        isCorrect,
      };
    });

    // Calculate the score
    const score = processedAnswers.filter((a) => a.isCorrect).length;

    // Save the user's answers
    const newQuizAnswer = new QuizAnswer({
      user,
      quiz: quizId,
      answers: processedAnswers,
      score,
    });

    await newQuizAnswer.save();

    res.status(201).json({ message: "Quiz submitted successfully", score });
  } catch (error) {
    console.error("Quiz Submission Error:", error.message);
    res.status(500).json({ error: "Failed to submit quiz" });
  }
};

const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedQuiz = await Quiz.findByIdAndDelete(id);

    if (!deletedQuiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    // Delete associated quiz answers
    await QuizAnswer.deleteMany({ quiz: id });

    res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete quiz" });
  }
};

module.exports = {
  generateQuiz,
  getQuizzesByUserId,
  getQuizById,
  submitQuiz,
  getQuizAnswerById,
  deleteQuiz,
};
