import mongoose from "mongoose";
const Schema = mongoose.Schema;

// design a muitople chatting systmet
// protocal to create a space
// create a space
// add a partianbt to space
// remove a partianbt to a space
// create  sections chanles when you create a state ,
//export the Api
//add testing

const codeExecution = new Schema({
  userId: String,
  starTime: Number,
  endTime: Number,
  code: String,
  memoryUsage: String,
  cpuUsage: String,
  output: String,
  errorMessage: String,
  jobId: String,
  language: String,
  duration: Number,
  projectId: String,
  runTimeStatus: String,
});

/** */

const CodeExecution = mongoose.model("codeExecution", codeExecution);

class CodeExecutionApi {
  constructor() {}
  // this is to created a space

  createMetric = async (metric) => {
    try {
      const result = await CodeExecution.create(metric);
      return result;
    } catch (error) {
      // If MongoDB is not available, just log and continue
      console.log('⚠️  Could not save metrics to database:', error.message);
      return null;
    }
  };
  deleteMetric = () => {};
  updateMetric = () => {};
  getMetricById = () => {};

  get = async (query) => {
    try {
      const { limit, skip, filter } = query;
      const logs = await CodeExecution.find(filter)
        .sort({ _id: -1 })
        .limit(limit)
        .skip(skip);
      return { succeeded: true, logs };
    } catch (error) {
      console.log('⚠️  Could not retrieve metrics from database:', error.message);
      return { succeeded: false, logs: [], error: 'Database not available' };
    }
  };
}

const codeExecutionApi = new CodeExecutionApi();
export default codeExecutionApi;
