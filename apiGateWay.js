import { remoteCode } from "./engine-application/remoteCode.js";
import codeExecutionApi from "./application/codeExecution.js";
// Execute the code

class ApiGateWay {
  constructor() {}
  // this is to created a space

  //verify if the key is valid
  executeCode = async ({ language, code, saveMetric = false }) => {
    if (!language || code == undefined) {
      return { succeeded: false, errorMessage: "Invalid input" };
    }

    const result = await remoteCode.runCode({
      language,
      code,
      userId: "anonymous",
      projectId: "default",
      saveMetric,
    });

    return { succeeded: true, result };
  };

  executeCodev2 = async ({
    language,
    files,
    saveMetric = false,
  }) => {
    if (!language || files == undefined) {
      return { succeeded: false, errorMessage: "Invalid input" };
    }
    
    const result = await remoteCode.runCodev2({
      language,
      files,
      userId: "anonymous",
      projectId: "default",
      saveMetric,
    });

    return { succeeded: true, result };
  };

  getLogs = async (query) => {
    return await codeExecutionApi.get(query);
  };
}

const apiGateWay = new ApiGateWay();
export default apiGateWay;
