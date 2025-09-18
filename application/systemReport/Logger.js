import mongoose from "mongoose";
const Schema = mongoose.Schema;
const loggerModal = new Schema({
  isError: Boolean,
  platform: String,
  date: String,
  message: String,
  fileName: String,
});

const LoggerModol = mongoose.model("logger", loggerModal);

class Logger {
  constructor() {}

  log = async (loggerDetail) => {
    try {
      await LoggerModol.create(loggerDetail); // Corrected this line
      return { succeeded: true };
    } catch (error) {}
  };
}

const logger = new Logger();

export default logger;
