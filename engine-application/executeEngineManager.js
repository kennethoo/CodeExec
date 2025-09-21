import fs from "fs";
import { exec } from "child_process";
import { v4 as uuidv4 } from "uuid";

class ExecuteEngineManager {
  constructor() {
    this.language = null;

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

    this.codeFolder = "./sandBox/remoteCode";

    this.outPutExccedError = "ERR_CHILD_PROCESS_STDIO_MAXBUFFER";

    this.timelimitExccedError = [124, 137];
  }

  getDockerImage = (language) => {
    if (language === this.JAVASCRIPT) {
      return this.RCE_NODE_IMAGE;
    } else if (language === this.PYTHON) {
      return this.RCE_PYTHON_IMAGE;
    } else if (language === this.JAVA) {
      return this.RCE_JAVA_IMAGE;
    } else if (language === this.GO) {
      return this.RCE_GOLANG;
    } else if (language === this.RUBY) {
      return this.RCE_RUBY;
    } else if (language === this.CPP) {
      return this.RCE_CPP;
    }
  };

  getExtenstion(language) {
    if (language === this.JAVASCRIPT) {
      return "js";
    } else if (language === this.PYTHON) {
      return "py";
    } else if (language === this.JAVA) {
      return "java";
    } else if (language === this.GO) {
      return "go";
    } else if (language === this.RUBY) {
      return "rb";
    } else if (language === this.CPP) {
      return "cpp";
    }
  }

  getDefaultFileName(language) {
    if (language === this.JAVASCRIPT) {
      return "script.js";
    } else if (language === this.PYTHON) {
      return "script.py";
    } else if (language === this.JAVA) {
      return "Main.java";
    } else if (language === this.GO) {
      return "Main.go";
    } else if (language === this.RUBY) {
      return "script.rb";
    } else if (language === this.CPP) {
      return "script.cpp";
    }
  }

  getDockerCommand({ language, jobName, volumeMount, dockerImageName }) {
    if (language === this.JAVASCRIPT) {
      // Add sleep infinity to keep the container alive after the code finishes
      return `docker run  --read-only -m 7m --ulimit cpu=10 --name ${jobName} -v ${volumeMount} ${dockerImageName} `;
    } else if (language === this.PYTHON) {
      return `docker run --read-only -m 32m --ulimit cpu=20 --name ${jobName} -v ${volumeMount} ${dockerImageName}`;
    } else if (language === this.JAVA) {
      return `docker run --read-only -m 50m --ulimit cpu=10 --name ${jobName} -v ${volumeMount} ${dockerImageName}`;
    } else if (language === this.GO) {
      return `docker run  -m 1.2g --ulimit cpu=100 --name ${jobName} -v ${volumeMount} ${dockerImageName}`;
    } else if (language === this.RUBY) {
      return `docker run  --read-only -m 7m --ulimit cpu=10 --name ${jobName} -v ${volumeMount} ${dockerImageName} `;
    } else if (language === this.CPP) {
      return `docker run  -m 1.2g --ulimit cpu=10 --name ${jobName} -v ${volumeMount} ${dockerImageName} `;
    }
  }

  //get the language that we want to run
  // do the container ccheck and stu
  setupRunTemplate(language) {
    const dockerImageName = this.getDockerImage(language);
    const fileExtenTension = this.getExtenstion(language);
    const defaultFileNanme = this.getDefaultFileName(language);
    const jobId = uuidv4();
    const jobName = `test-${jobId}`;
    const fileName = `script-${jobId}.${fileExtenTension}`;
    const filePath = `${this.codeFolder}/${fileName}`;
    const volumeMount = `${filePath}:/app/${defaultFileNanme}:ro`;

    const dockerCommand = this.getDockerCommand({
      language,
      jobName,
      volumeMount,
      dockerImageName,
    });
    const buildCommand = `docker build ./docker-images/${language} -t ${dockerImageName}`;
    const checkImageCommand = `docker image inspect ${dockerImageName}`;

    return {
      dockerImageName,
      fileExtenTension,
      defaultFileNanme,
      jobId,
      jobName,
      fileName,
      filePath,
      volumeMount,
      dockerCommand,
      buildCommand,
      checkImageCommand,
    };
  }

  async executeCode({ dockerCommand, jobName, filePath, jobId }) {
    return new Promise((resolve) => {
      const startTime = new Date();
      exec(dockerCommand, (errorLogs, logs, stderrLogs) => {
        const endTime = new Date();
        fs.unlink(filePath, () => {});
        const outputLogs = logs || "";

        exec(
          `docker stats --no-stream --format "{{json .}}" ${jobName}`,
          (errorStats, statsStdout, _) => {
            let memoryUsage = "";
            let cpuUsage = "";
            if (!errorStats) {
              const stats = JSON.parse(statsStdout.trim());
              cpuUsage = stats.CPUPerc.trim();
              memoryUsage = stats.MemUsage.split("/")[0].trim();
            }

            const executionTime = Math.abs((endTime - startTime) / 1000);
            const succeeded = !errorLogs && !errorStats && !stderrLogs;
            const errorResult = this.getErrorMessage({
              stderrLogs,
              errorLogs,
            });

            const finalErrorMessage = errorResult.message;

            // Resolve with all relevant data
            resolve({
              jobId,
              startTime,
              endTime,
              succeeded,
              output: errorResult.didOupoutExeeded
                ? outputLogs.substring(0, 2000)
                : outputLogs,
              errorMessage: finalErrorMessage,
              executionTime,
              memoryUsage,
              cpuUsage,
              runTimeStatus: succeeded ? "succeeded" : "Error",
            });

            exec(
              `docker stop ${jobName} && docker rm ${jobName}`,
              (errorKill, stdoutKill, stderrKill) => {}
            );
          }
        );
      });
    });
  }

  getErrorMessage({ errorLogs, stderrLogs }) {
    let message = "";
    let didOupoutExeeded = false;
    if (stderrLogs) {
      message = stderrLogs;
    }

    if (!stderrLogs && errorLogs) {
      const { code } = errorLogs;

      if (this.timelimitExccedError.includes(code)) {
        message = "Time Limit exceeded";
      }
      if (this.outPutExccedError.includes(code)) {
        message =
          "RangeError [ERR_CHILD_PROCESS_STDIO_MAXBUFFER]: stdout maxBuffer length exceeded";
        didOupoutExeeded = true;
      }
    }

    return { message, didOupoutExeeded };
  }

  async execute(code, language) {
    return new Promise(async (resolve) => {
      const {
        dockerImageName,
        fileExtenTension,
        defaultFileNanme,
        jobId,
        jobName,
        fileName,
        filePath,
        volumeMount,
        checkImageCommand,
        buildCommand,
        dockerCommand,
      } = this.setupRunTemplate(language);

      await fs.writeFileSync(filePath, code);

      exec(
        checkImageCommand,
        async (inspectError, inspectStdout, inspectStderr) => {
          if (inspectError) {
            // Image does not exist locally, so build it
            exec(buildCommand, async (buildError, buildStdout, buildStderr) => {
              if (buildError) {
                fs.unlink(filePath, () => {});
                resolve({
                  succeeded: false,
                  output: buildStderr,
                  errorMessage: buildStderr,
                });
                return;
              }

              const result = await this.executeCode({
                dockerImageName,
                fileExtenTension,
                defaultFileNanme,
                jobId,
                jobName,
                fileName,
                filePath,
                volumeMount,
                checkImageCommand,
                buildCommand,
                code,
                dockerCommand,
              });

              resolve(result);
            });
          } else {
            const result = await this.executeCode({
              dockerImageName,
              fileExtenTension,
              defaultFileNanme,
              jobId,
              jobName,
              fileName,
              filePath,
              volumeMount,
              checkImageCommand,
              buildCommand,
              code,
              dockerCommand,
            });
            resolve(result);
          }
        }
      );
    });
  }
}

const executeEngineManager = new ExecuteEngineManager();

export default executeEngineManager;
