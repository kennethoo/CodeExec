import fs from "fs";
import { exec } from "child_process";
import { v4 as uuidv4 } from "uuid";
import path from "path";

class ExecuteEngineManagerV2 {
  constructor() {
    this.language = null;

    this.JAVASCRIPT = "javascript";
    this.PYTHON = "python";
    this.GO = "go";
    this.JAVA = "java";
    this.CPP = "cpp";
    this.RUBY = "ruby";
    this.MEETTUM_NODE_IMAGE = "meetcode/meettum-node-image:v1.0";
    this.MEETTUM_PYTHON_IMAGE = "meetcode/meettum-python-image:v1.0";
    this.MEETTUM_JAVA_IMAGE = "meetcode/meettum-java-image";
    this.MEETTUM_GOLANG = "meetcode/meettum-go-image";
    this.MEETTUM_CPP = "meetcode/meettum-cpp-image";
    this.MEETTUM_RUBY = "meetcode/meettum-ruby-image";

    this.codeFolder = "./sandBox/tempSanbox";

    this.outPutExccedError = "ERR_CHILD_PROCESS_STDIO_MAXBUFFER";

    this.timelimitExccedError = [124, 137];
  }

  getDockerImage = (language) => {
    if (language === this.JAVASCRIPT) {
      return this.MEETTUM_NODE_IMAGE;
    } else if (language === this.PYTHON) {
      return this.MEETTUM_PYTHON_IMAGE;
    } else if (language === this.JAVA) {
      return this.MEETTUM_JAVA_IMAGE;
    } else if (language === this.GO) {
      return this.MEETTUM_GOLANG;
    } else if (language === this.RUBY) {
      return this.MEETTUM_RUBY;
    } else if (language === this.CPP) {
      return this.MEETTUM_CPP;
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
      return `docker run --read-only -m 50m --ulimit cpu=10 --name ${jobName} -v ${volumeMount}  --tmpfs /app/build ${dockerImageName}`;
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
  setupRunTemplate(language, files) {
    const dockerImageName = this.getDockerImage(language);
    const fileExtenTension = this.getExtenstion(language);
    const jobId = uuidv4();
    const jobName = `test-${jobId}`;
    const folderPath = this.generateTempFolder(files, jobId);
    const fileName = `script-${jobId}.${fileExtenTension}`;
    const volumeMount = `${folderPath}:/app/src:ro`;

    const dockerCommand = this.getDockerCommand({
      language,
      jobName,
      volumeMount,
      dockerImageName,
    });
    const buildCommand = `docker build ./docker_images/${language} -t ${dockerImageName}`;
    const checkImageCommand = `docker image inspect ${dockerImageName}`;

    return {
      dockerImageName,
      fileExtenTension,
      jobId,
      jobName,
      fileName,
      volumeMount,
      dockerCommand,
      buildCommand,
      checkImageCommand,
      folderPath,
    };
  }

  generateTempFolder = (files, jobId) => {
    const directory = `./sandBox/tempSanbox/${jobId}`;
    fs.mkdirSync(directory, { recursive: true });
    for (const file of files) {
      const filePath = path.join(directory, file.filename);
      fs.writeFileSync(filePath, file.code);
    }
    return directory;
  };
  async executeCode({ dockerCommand, jobName, jobId, folderPath }) {
    return new Promise((resolve) => {
      const startTime = new Date();
      exec(dockerCommand, (errorLogs, logs, stderrLogs) => {
        const endTime = new Date();
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

            fs.rm(folderPath, { recursive: true }, (err) => {});
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

  async execute(files, language) {
    return new Promise(async (resolve) => {
      const {
        dockerImageName,
        fileExtenTension,
        defaultFileNanme,
        jobId,
        jobName,
        fileName,
        volumeMount,
        checkImageCommand,
        buildCommand,
        dockerCommand,
        folderPath,
      } = this.setupRunTemplate(language, files);

      exec(
        checkImageCommand,
        async (inspectError, inspectStdout, inspectStderr) => {
          if (inspectError) {
            // Image does not exist locally, so build it
            exec(buildCommand, async (buildError, buildStdout, buildStderr) => {
              if (buildError) {
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
                volumeMount,
                checkImageCommand,
                buildCommand,
                dockerCommand,
                folderPath,
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
              volumeMount,
              checkImageCommand,
              buildCommand,
              dockerCommand,
              folderPath,
            });
            resolve(result);
          }
        }
      );
    });
  }
}

const executeEngineManagerv2 = new ExecuteEngineManagerV2();

export default executeEngineManagerv2;
