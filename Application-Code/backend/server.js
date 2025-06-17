require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const InterviewRouter = require("./routes/Interview");
const AuthRoute = require("./routes/user");
const connection = require("./db");
const recommendationsRouter = require("./routes/Recommendation");
const QuizRoute = require("./routes/Quiz");
const CvRoute = require("./routes/Cv");
const ChallengeRoute = require("./routes/Defi");
const AnalyseRoute = require("./routes/SoftSkillAnalyse");
const PaymentAnalytics = require("./routes/PaymentStatics");
const { initializeSocket } = require("./socket");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 9000;
const server = http.createServer(app);
initializeSocket(server);

// Middleware
app.use(express.json());
app.use(cors());

const uploadsPath = path.join(__dirname, "/uploads");
console.log("Uploads directory path:", uploadsPath);
app.use("/uploads", express.static(uploadsPath));
// MongoDB Connection
connection();
let lastReadyState = null; 
app.get('/ready', (req, res) => {
    // Here you can add logic to check database connection or other dependencies
    const isDbConnected = mongoose.connection.readyState === 1;
    if (isDbConnected !== lastReadyState) {
        console.log(`Database readyState: ${mongoose.connection.readyState}`);
        lastReadyState = isDbConnected;
    }
    
    if (isDbConnected) {
        res.status(200).send('Ready');
    } else {
        res.status(503).send('Not Ready');
    }
});
// Routes

app.use("/api/interview", InterviewRouter);
app.use("/api/auth", AuthRoute);
app.use("/api", recommendationsRouter);
app.use("/api/quiz", QuizRoute);
app.use("/api/cv", CvRoute);
app.use("/api/analyse", AnalyseRoute);
app.use("/api/challenges", ChallengeRoute);
app.use("/api/payment", PaymentAnalytics);
// Default Route
app.get("/", (req, res) => {
  res.send("Welcome to Express API!");
});

// Start Server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
