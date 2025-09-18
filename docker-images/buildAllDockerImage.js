//This file will eventually be remote that way we can just pull images images that we want from a remote container registry
// but it will serve as just documentation
import { exec } from "child_process";
export function buildJavascriptImage() {
  const imageName = "meettum-node-image";
  const path = "./docker-images/javascript";
  const dockerCommand = `docker build  ${path}  -t ${imageName}`;
  exec(dockerCommand, (error, stdout, stderr) => {});
}

export function buildJavaImage() {
  const imageName = "meettum-java-image";
  const path = "./docker-images/java";
  const dockerCommand = `docker build  ${path}  -t ${imageName}`;
  exec(dockerCommand, (error, stdout, stderr) => {});
}

export function buildPythonImage() {
  const imageName = "meettum-python-image";
  const path = "./docker-images/python";
  const dockerCommand = `docker build  ${path}  -t ${imageName}`;
  exec(dockerCommand, (error, stdout, stderr) => {});
}

export function createAllDockerImages() {
  buildJavascriptImage();
  buildPythonImage();
  buildJavaImage();
}
