const mongoose = require("mongoose");

module.exports = async () => {
  try {
    const useDBAuth = process.env.USE_DB_AUTH === "true";
    const username = process.env.MONGO_USERNAME;
    const password = process.env.MONGO_PASSWORD;
    const host = process.env.MONGO_HOST || "localhost";
    const dbName = process.env.MONGO_DB || "test";

    let mongoUri;

    if (useDBAuth) {
      mongoUri = `mongodb://${username}:${password}@${host}:27017/${dbName}?authSource=admin`;
    } else {
      mongoUri = `mongodb://${host}:27017/${dbName}`;
    }

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to database.");
  } catch (error) {
    console.error("❌ Could not connect to database:", error.message);
  }
};
