import dotenv from "dotenv";
import { connectDatabase } from "./config/database";
import app from "./app";

dotenv.config();
const PORT = process.env.PORT;

const startServer = async (): Promise<void> => {
  try {
    connectDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start:", error);
  }
};

startServer();
