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
    const result = await CodeExecution.create(metric);

    return result;
  };
  deleteMetric = () => {};
  updateMetric = () => {};
  getMetricById = () => {};

  get = async (query) => {
    const { limit, skip, filter } = query;
    const logs = await CodeExecution.find(filter)
      .sort({ _id: -1 })
      .limit(limit)
      .skip(skip);
    return { succeeded: true, logs };
  };
}

const codeExecutionApi = new CodeExecutionApi();
export default codeExecutionApi;
