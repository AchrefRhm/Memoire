const mongoose = require("mongoose");

module.exports = async () => {
  try {
    const connectionParams = {};

    const useDBAuth = process.env.USE_DB_AUTH;
    if (useDBAuth) {
      connectionParams.user = process.env.MONGO_USERNAME;
      connectionParams.pass = process.env.MONGO_PASSWORD;
    }

    await mongoose.connect(process.env.MONGO_CONN_STR, connectionParams);
    console.log("Connected to database.");
  } catch (error) {
    console.error("Could not connect to database.", error);
  }
};

