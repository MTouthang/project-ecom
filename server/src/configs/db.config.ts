import mongoose from "mongoose";

mongoose.set("strictQuery", true);
mongoose.set("runValidators", true); // run validation during update

const dbConnection = async () => {
  try {
    const dBURL =
      process.env.MONGODBURL || "mongodb://127.0.0.1:27017/projectUdemy";
    const { connection } = await mongoose.connect(dBURL);
    if (connection) {
      console.log(`Connected to MongoDB: ${connection.host}`);
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default dbConnection;
