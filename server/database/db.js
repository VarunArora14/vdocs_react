import mongoose from "mongoose";

const connectDB = async () => {
  const URL = process.env.MONGO_URL;

  try {
    await mongoose.connect(URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("Connected to DB");
  } catch (e) {
    console.log("Error in connecting to DB", e);
  }
};

export default connectDB;
