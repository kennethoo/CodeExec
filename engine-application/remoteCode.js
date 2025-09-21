import codeExecutionApi from "../application/codeExecution.js";
import executeEngineManager from "./executeEngineManager.js";
import executeEngineManagerv2 from "./executeEngineManagerv2.js";
export class RemoteEnginerMannager {
  constructor() {
    this.JAVASCRIPT = "javascript";
    this.PYTHON = "python";
    this.GO = "go";
    this.JAVA = "java";
    this.CPP = "cpp";
    this.RUBY = "ruby";
    this.RCE_NODE_IMAGE = "rce/node-image:v1.0";
    this.RCE_PYTHON_IMAGE = "rce/python-image:v1.0";
    this.RCE_JAVA_IMAGE = "rce/java-image";
    this.RCE_GOLANG = "rce/go-image";
    this.RCE_CPP = "rce/cpp-image";
    this.RCE_RUBY = "rce/ruby-image";

    this.supportedLanGuage = [
      this.JAVASCRIPT,
      this.JAVA,
      this.PYTHON,
      this.GO,
      this.RUBY,
      this.CPP,
    ];
  }
  runCode = async ({ language, code, userId, projectId, saveMetric }) => {
    if (!language) {
      return {
        succeeded: false,
        output: "Please add a language  and code",
      };
    }

    if (!this.isSuportedLanguage(language)) {
      return {
        succeeded: false,
        output: "This Language is not suppoted",
      };
    }

    const result = await executeEngineManager.execute(code, language);

    const resultPayload = {
      userId,
      starTime: result.startTime,
      endTime: result.endTime,
      code,
      language,
      jobId: result.jobId,
      output: result.output,
      errorMessage: result.errorMessage,
      duration: result.executionTime,
      projectId,
      memoryUsage: result.memoryUsage,
      cpuUsage: result.cpuUsage,
      runTimeStatus: result.runTimeStatus,
    };

    if (saveMetric) {
      codeExecutionApi.createMetric(resultPayload);
    }

    return resultPayload;
  };

  runCodev2 = async ({ language, files, userId, projectId, saveMetric }) => {
    if (!language) {
      return {
        succeeded: false,
        output: "Please add a language  and code",
      };
    }
    if (!this.isSuportedLanguage(language)) {
      return {
        succeeded: false,
        output: "This Language is not suppoted",
      };
    }

    const result = await executeEngineManagerv2.execute(files, language);
    const resultPayload = {
      userId,
      starTime: result.startTime,
      endTime: result.endTime,
      language,
      jobId: result.jobId,
      output: result.output,
      errorMessage: result.errorMessage,
      duration: result.executionTime,
      projectId,
      memoryUsage: result.memoryUsage,
      cpuUsage: result.cpuUsage,
      runTimeStatus: result.runTimeStatus,
      files,
    };

    if (saveMetric) {
      codeExecutionApi.createMetric(resultPayload);
    }

    return resultPayload;
  };

  isSuportedLanguage(language) {
    return this.supportedLanGuage.includes(language);
  }
}

export const remoteCode = new RemoteEnginerMannager();
