# CodeExec RCE - Anonymous Code Execution Service

A simple, secure, and **anonymous** Remote Code Execution (RCE) service that allows anyone to execute code in multiple programming languages through Docker-isolated containers. No authentication required!

## 🎯 Overview

CodeExec RCE is a **free** and **anonymous** code execution service that provides:
- **Secure code execution** in isolated Docker containers
- **Multi-language support** (JavaScript, Python, Java, Go, C++, Ruby)
- **Resource management** with memory and CPU limits
- **Anonymous execution** - no user accounts or authentication needed
- **Execution metrics** and logging (optional)

## 🚀 How It Works

### **The Big Picture**
When you send code to our API, here's what happens behind the scenes:

1. **📥 Request Arrives**: Your code and language choice hit our API endpoint
2. **🔍 Validation**: We check if the language is supported and code is valid
3. **🐳 Docker Magic**: We spin up a fresh, isolated container for your specific language
4. **⚡ Execution**: Your code runs safely inside the container with strict resource limits
5. **📤 Results**: We capture the output, errors, and performance metrics
6. **🧹 Cleanup**: The container is automatically destroyed after execution

### **Why We Built It This Way**

#### **🔒 Security First**
- **Container Isolation**: Each code execution runs in a completely isolated Docker container
- **No Persistent Storage**: Containers are destroyed after execution - no data leaks
- **Resource Limits**: Memory and CPU limits prevent resource exhaustion attacks
- **Read-only Filesystems**: Most containers run read-only to prevent system modification

#### **🌐 Anonymous by Design**
- **No Authentication**: We believe code execution should be accessible to everyone
- **No User Tracking**: We don't store personal information or track users
- **Simple API**: Just send your code and get results - no signup required

#### **⚡ Performance Optimized**
- **Language-Specific Images**: Pre-built Docker images for each language
- **Resource Allocation**: Different languages get appropriate memory/CPU limits
- **Automatic Cleanup**: Containers are destroyed immediately after execution

### **🐳 Docker Architecture Explained**

#### **Why Docker?**
Docker provides the perfect solution for secure code execution because:

1. **Isolation**: Each execution runs in a completely separate environment
2. **Consistency**: Same execution environment every time, regardless of host system
3. **Security**: Containers can't access the host system or other containers
4. **Resource Control**: We can limit memory, CPU, and execution time
5. **Cleanup**: Containers are ephemeral - they disappear after execution

#### **Our Docker Strategy**

```
┌─────────────────────────────────────────────────────────────┐
│                    Host System                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │  JavaScript     │  │    Python       │  │    Java     │ │
│  │  Container      │  │   Container     │  │  Container  │ │
│  │  (7MB limit)    │  │  (32MB limit)   │  │(50MB limit) │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │      Go         │  │      C++        │  │    Ruby     │ │
│  │   Container     │  │   Container     │  │  Container  │ │
│  │(1.2GB limit)    │  │(1.2GB limit)    │  │(7MB limit)  │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

#### **Language-Specific Resource Allocation**

| Language | Memory Limit | CPU Limit | Container Type | Why This Way? |
|----------|-------------|-----------|----------------|---------------|
| **JavaScript** | 7MB | 10% | Read-only | Lightweight, fast startup |
| **Python** | 32MB | 20% | Read-only | More memory for libraries |
| **Java** | 50MB | 10% | Read-only | JVM overhead requires more memory |
| **Go** | 1.2GB | 100% | Writable | Compiled language, needs build space |
| **C++** | 1.2GB | 10% | Writable | Compilation requires temporary files |
| **Ruby** | 7MB | 10% | Read-only | Interpreted, similar to JavaScript |

#### **Security Features**

```bash
# Example Docker command for JavaScript
docker run \
  --read-only \                    # Prevent file system writes
  -m 7m \                         # Memory limit
  --ulimit cpu=10 \               # CPU limit
  --name job-123 \                # Unique container name
  -v /path/to/code:/app/script.js:ro \  # Mount code as read-only
  rce/node-image:v1.0             # Language-specific image
```

## 🏗️ Architecture

### Core Components

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Client App    │───▶│   API Gateway    │───▶│  Code Execution │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │  Execution Logs  │    │  Docker Engine  │
                       └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │     MongoDB      │
                       └──────────────────┘
```

### File Structure

```
├── server.js                          # Main Express server (missing)
├── apiGateWay.js                      # Simple API orchestration
├── router/
│   └── engineRouter.js                # Code execution endpoints
├── engine-application/
│   ├── executeEngineManager.js        # Single-file execution
│   ├── executeEngineManagerv2.js      # Multi-file execution
│   └── remoteCode.js                  # Execution coordinator
├── application/
│   └── codeExecution.js               # Optional metrics logging
├── docker-images/                     # Language-specific Docker configs
│   ├── python/Dockerfile
│   ├── javascript/Dockerfile
│   ├── java/Dockerfile
│   ├── go/Dockerfile
│   ├── cpp/Dockerfile
│   └── ruby/Dockerfile
└── config/
    └── keys.js                        # Configuration
```

## 🔧 Technical Implementation

### **1. Request Flow Architecture**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Client        │───▶│   API Gateway    │───▶│  Execution      │
│   (Your Code)   │    │   (Validation)   │    │  Engine         │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │  Optional        │    │  Docker         │
                       │  Metrics DB      │    │  Container      │
                       └──────────────────┘    └─────────────────┘
```

### **2. Docker Isolation Strategy**

**File**: `engine-application/executeEngineManager.js`

```javascript
// Language-specific Docker images
this.RCE_NODE_IMAGE = "rce/node-image:v1.0";
this.RCE_PYTHON_IMAGE = "rce/python-image:v1.0";
this.RCE_JAVA_IMAGE = "rce/java-image";
this.RCE_GOLANG = "rce/go-image";
this.RCE_CPP = "rce/cpp-image";
this.RCE_RUBY = "rce/ruby-image";

// Dynamic Docker command generation
getDockerCommand({ language, jobName, volumeMount, dockerImageName }) {
  if (language === this.JAVASCRIPT) {
    return `docker run --read-only -m 7m --ulimit cpu=10 --name ${jobName} -v ${volumeMount} ${dockerImageName}`;
  } else if (language === this.PYTHON) {
    return `docker run --read-only -m 32m --ulimit cpu=20 --name ${jobName} -v ${volumeMount} ${dockerImageName}`;
  }
  // ... other languages with different limits
}
```

### **3. Why We Chose This Architecture**

#### **🏗️ Microservices Approach**
- **API Gateway**: Single entry point for all requests
- **Execution Engines**: Separate managers for single-file vs multi-file execution
- **Container Orchestration**: Docker handles all the heavy lifting

#### **🔒 Security by Design**
```javascript
// Example: JavaScript execution with security
const dockerCommand = `docker run \
  --read-only \                    // No file system writes
  -m 7m \                         // 7MB memory limit
  --ulimit cpu=10 \               // 10% CPU limit
  --name job-${jobId} \           // Unique container name
  -v ${codePath}:/app/script.js:ro \  // Mount code as read-only
  rce/node-image:v1.0             // Language-specific image
`;
```

#### **⚡ Performance Optimizations**
- **Pre-built Images**: Docker images are built once and reused
- **Resource Allocation**: Each language gets appropriate resources
- **Container Reuse**: Images are cached, containers are ephemeral
- **Parallel Execution**: Multiple containers can run simultaneously

### **4. Error Handling & Edge Cases**

#### **Resource Exhaustion**
```javascript
// Memory limit exceeded
if (error.code === 137) {
  return {
    succeeded: false,
    errorMessage: "Memory limit exceeded",
    runTimeStatus: "Error"
  };
}

// CPU limit exceeded  
if (error.code === 124) {
  return {
    succeeded: false,
    errorMessage: "Time limit exceeded",
    runTimeStatus: "Error"
  };
}
```

#### **Output Truncation**
```javascript
// Prevent massive outputs from crashing the system
const maxOutputLength = 2000;
const truncatedOutput = output.length > maxOutputLength 
  ? output.substring(0, maxOutputLength) + "... [truncated]"
  : output;
```

### **5. Container Lifecycle Management**

```javascript
// 1. Create temporary file
const tempFile = `/tmp/code-${jobId}.${extension}`;
fs.writeFileSync(tempFile, code);

// 2. Start container
const container = await docker.run(imageName, [], {
  name: `job-${jobId}`,
  mounts: [{ source: tempFile, target: '/app/script.js', readOnly: true }],
  memory: '7m',
  cpu: 10
});

// 3. Capture output
const output = await container.output();

// 4. Cleanup
await container.remove();
fs.unlinkSync(tempFile);
```

### 2. **Code Execution Flow**

**File**: `engine-application/remoteCode.js`

```javascript
runCode = async ({ language, code, userId, projectId, saveMetric }) => {
  // 1. Validate language support
  if (!this.isSuportedLanguage(language)) {
    return { succeeded: false, output: "Language not supported" };
  }

  // 2. Execute in Docker container
  const result = await executeEngineManager.execute(code, language);

  // 3. Log execution metrics
  const resultPayload = {
    userId, language, jobId: result.jobId,
    output: result.output, errorMessage: result.errorMessage,
    duration: result.executionTime, memoryUsage: result.memoryUsage,
    cpuUsage: result.cpuUsage, runTimeStatus: result.runTimeStatus
  };

  // 4. Save metrics if requested
  if (saveMetric) {
    codeExecutionApi.createMetric(resultPayload);
  }

  return resultPayload;
};
```

### 3. **API Endpoints**

**File**: `router/engineRouter.js`

```javascript
// Single file execution
router.post("/api/v1/execute", async function (req, res) {
  const data = await apiGateWay.executeCode(req.body);
  res.send(data);
});

// Multi-file project execution
router.post("/api/v2/execute", async function (req, res) {
  const data = await apiGateWay.executeCodev2(req.body);
  res.send(data);
});
```

### 4. **Anonymous Execution Flow**

**File**: `apiGateWay.js`

```javascript
// Simple anonymous execution
executeCode = async ({ language, code, saveMetric = false }) => {
  if (!language || code == undefined) {
    return { succeeded: false, errorMessage: "Invalid input" };
  }

  const result = await remoteCode.runCode({
    language,
    code,
    userId: "anonymous",    // No authentication needed
    projectId: "default",   // No project management
    saveMetric,
  });

  return { succeeded: true, result };
};
```

**Key Features**:
- **No Authentication**: Direct code execution without user accounts
- **Anonymous**: All executions run as "anonymous" user
- **Simple API**: Just language, code, and optional metrics

## 🐳 Docker Configuration

### Language-Specific Dockerfiles

**Python** (`docker-images/python/Dockerfile`):
```dockerfile
FROM python
WORKDIR /app
COPY . .
CMD ["python","script.py"]
```

**JavaScript** (`docker-images/javascript/Dockerfile`):
```dockerfile
FROM node:15
WORKDIR /app
COPY . ./
CMD ["node","script.js"]
```

### Resource Allocation

| Language | Memory Limit | CPU Limit | Container Type |
|----------|-------------|-----------|----------------|
| JavaScript | 7MB | 10% | Read-only |
| Python | 32MB | 20% | Read-only |
| Java | 50MB | 10% | Read-only |
| Go | 1.2GB | 100% | Writable |
| C++ | 1.2GB | 10% | Writable |
| Ruby | 7MB | 10% | Read-only |

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- Docker
- MongoDB (optional - only for metrics logging)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd codeexec-rce-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables** (optional)
```bash
# Create .env file
echo "DB=mongodb://localhost:27017/codeexec" > .env
echo "PORT=3000" >> .env
```

4. **Build Docker images**
```bash
node docker-images/buildAllDockerImage.js
```

5. **Start the server**
```bash
npm start
# or for development with auto-restart
npm run dev
```

### Environment Variables

```env
# Optional - only for metrics logging
# DB=mongodb://localhost:27017/rce-code-execution

# Server port
PORT=3000

# Environment
NODE_ENV=development
```

**Note**: The service works perfectly **without MongoDB**! Metrics logging is optional. If you don't have MongoDB installed, just run the server without the `DB` environment variable.

## 👤 User Journey

### **Step-by-Step Experience**

#### **1. 🚀 Getting Started (30 seconds)**
```bash
# No installation needed! Just make an API call
curl -X POST http://your-rce-server.com/api/v1/execute \
  -H "Content-Type: application/json" \
  -d '{
    "language": "javascript",
    "code": "console.log(\"Hello, RCE!\")",
    "saveMetric": false
  }'
```

#### **2. 📝 Writing Your First Program**
Let's say you want to run a Python script:

```python
# Your Python code
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(f"Fibonacci(10) = {fibonacci(10)}")
```

#### **3. 🎯 Making the API Call**
```bash
curl -X POST http://your-rce-server.com/api/v1/execute \
  -H "Content-Type: application/json" \
  -d '{
    "language": "python",
    "code": "def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n\nprint(f\"Fibonacci(10) = {fibonacci(10)}\")",
    "saveMetric": true
  }'
```

#### **4. ⚡ What Happens Behind the Scenes**

```
┌─────────────────────────────────────────────────────────────┐
│  Your Request                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ POST /api/v1/execute                               │   │
│  │ {                                                  │   │
│  │   "language": "python",                           │   │
│  │   "code": "def fibonacci(n):...",                 │   │
│  │   "saveMetric": true                              │   │
│  │ }                                                  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│  API Gateway Validation                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ✅ Language supported? (python)                    │   │
│  │ ✅ Code provided? (yes)                            │   │
│  │ ✅ Input valid? (yes)                              │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│  Docker Container Creation                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🐳 docker run --read-only -m 32m --ulimit cpu=20   │   │
│  │    --name job-abc123                               │   │
│  │    -v /tmp/code.py:/app/script.py:ro               │   │
│  │    rce/python-image:v1.0                           │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│  Code Execution                                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ python script.py                                   │   │
│  │ > Fibonacci(10) = 55                               │   │
│  │ > Execution time: 0.023s                           │   │
│  │ > Memory used: 2.1MB                               │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│  Response & Cleanup                                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ {                                                  │   │
│  │   "succeeded": true,                               │   │
│  │   "result": {                                      │   │
│  │     "output": "Fibonacci(10) = 55",               │   │
│  │     "executionTime": 0.023,                       │   │
│  │     "memoryUsage": "2.1MB",                       │   │
│  │     "runTimeStatus": "succeeded"                  │   │
│  │   }                                                │   │
│  │ }                                                  │   │
│  │ 🧹 Container destroyed                            │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

#### **5. 🎉 You Get Your Results**
```json
{
  "succeeded": true,
  "result": {
    "jobId": "abc123-def456",
    "output": "Fibonacci(10) = 55",
    "errorMessage": null,
    "executionTime": 0.023,
    "memoryUsage": "2.1MB",
    "cpuUsage": "5.2%",
    "runTimeStatus": "succeeded"
  }
}
```

### **Real-World Use Cases**

#### **🎓 Educational Platform**
```javascript
// Student learning JavaScript
const result = await fetch('/api/v1/execute', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    language: 'javascript',
    code: studentCode,
    saveMetric: true
  })
});
```

#### **🧪 Code Testing & Validation**
```python
# Automated testing pipeline
def test_user_code():
    response = requests.post('/api/v1/execute', json={
        'language': 'python',
        'code': user_submission,
        'saveMetric': False
    })
    return response.json()['result']['runTimeStatus'] == 'succeeded'
```

#### **📊 Algorithm Benchmarking**
```bash
# Compare performance across languages
for lang in javascript python java go; do
  curl -X POST /api/v1/execute \
    -d "{\"language\":\"$lang\",\"code\":\"$algorithm_code\"}"
done
```

### **🔄 Multi-File Projects**

For complex projects with multiple files:

```bash
curl -X POST http://your-rce-server.com/api/v2/execute \
  -H "Content-Type: application/json" \
  -d '{
    "language": "python",
    "files": [
      {
        "filename": "main.py",
        "code": "from utils import helper\nprint(helper.calculate(10))",
        "isEntryPoint": true
      },
      {
        "filename": "utils.py", 
        "code": "def calculate(n):\n    return n * 2",
        "isEntryPoint": false
      }
    ],
    "saveMetric": true
  }'
```

## 📊 API Usage

### **🔧 cURL Examples**

#### **1. Health Check**
```bash
# Check if the service is running
curl http://localhost:3000/health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "RCE Code Execution Service",
  "version": "1.0.0"
}
```

#### **2. Service Information**
```bash
# Get API documentation and supported languages
curl http://localhost:3000/
```

#### **3. Single File Execution**

##### **JavaScript Example**
```bash
curl -X POST http://localhost:3000/api/v1/execute \
  -H "Content-Type: application/json" \
  -d '{
  "language": "javascript",
    "code": "console.log(\"Hello from RCE!\");\nconsole.log(\"Current time:\", new Date());",
    "saveMetric": true
  }'
```

##### **Python Example**
```bash
curl -X POST http://localhost:3000/api/v1/execute \
  -H "Content-Type: application/json" \
  -d '{
    "language": "python",
    "code": "def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n\nprint(f\"Fibonacci(10) = {fibonacci(10)}\")",
    "saveMetric": true
  }'
```

##### **Java Example**
```bash
curl -X POST http://localhost:3000/api/v1/execute \
  -H "Content-Type: application/json" \
  -d '{
    "language": "java",
    "code": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello from Java!\");\n        System.out.println(\"Java version: \" + System.getProperty(\"java.version\"));\n    }\n}",
    "saveMetric": true
  }'
```

##### **Go Example**
```bash
curl -X POST http://localhost:3000/api/v1/execute \
  -H "Content-Type: application/json" \
  -d '{
    "language": "go",
    "code": "package main\n\nimport \"fmt\"\n\nfunc main() {\n    fmt.Println(\"Hello from Go!\")\n    fmt.Println(\"Go is awesome!\")\n}",
    "saveMetric": true
  }'
```

##### **C++ Example**
```bash
curl -X POST http://localhost:3000/api/v1/execute \
  -H "Content-Type: application/json" \
  -d '{
    "language": "cpp",
    "code": "#include <iostream>\n#include <vector>\n\nint main() {\n    std::vector<int> numbers = {1, 2, 3, 4, 5};\n    int sum = 0;\n    for(int num : numbers) {\n        sum += num;\n    }\n    std::cout << \"Sum: \" << sum << std::endl;\n    return 0;\n}",
    "saveMetric": true
  }'
```

##### **Ruby Example**
```bash
curl -X POST http://localhost:3000/api/v1/execute \
  -H "Content-Type: application/json" \
  -d '{
    "language": "ruby",
    "code": "puts \"Hello from Ruby!\"\nputs \"Ruby version: #{RUBY_VERSION}\"\n\n# Simple array operations\nnumbers = [1, 2, 3, 4, 5]\nputs \"Sum: #{numbers.sum}\"",
  "saveMetric": true
  }'
```

#### **4. Multi-File Execution**

##### **Python Multi-File Project**
```bash
curl -X POST http://localhost:3000/api/v2/execute \
  -H "Content-Type: application/json" \
  -d '{
  "language": "python",
  "files": [
    {
      "filename": "main.py",
        "code": "from math_utils import calculate_fibonacci\nfrom string_utils import format_output\n\nif __name__ == \"__main__\":\n    n = 10\n    result = calculate_fibonacci(n)\n    output = format_output(n, result)\n    print(output)",
        "isEntryPoint": true
      },
      {
        "filename": "math_utils.py",
        "code": "def calculate_fibonacci(n):\n    if n <= 1:\n        return n\n    return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)",
        "isEntryPoint": false
      },
      {
        "filename": "string_utils.py",
        "code": "def format_output(n, result):\n    return f\"Fibonacci({n}) = {result}\"",
        "isEntryPoint": false
      }
    ],
    "saveMetric": true
  }'
```

##### **JavaScript Multi-File Project**
```bash
curl -X POST http://localhost:3000/api/v2/execute \
  -H "Content-Type: application/json" \
  -d '{
    "language": "javascript",
    "files": [
      {
        "filename": "app.js",
        "code": "const { Calculator } = require(\"./calculator\");\nconst { Logger } = require(\"./logger\");\n\nconst calc = new Calculator();\nconst logger = new Logger();\n\nconst result = calc.add(10, 20);\nlogger.log(`Result: ${result}`);",
      "isEntryPoint": true
      },
      {
        "filename": "calculator.js",
        "code": "class Calculator {\n    add(a, b) {\n        return a + b;\n    }\n    \n    multiply(a, b) {\n        return a * b;\n    }\n}\n\nmodule.exports = { Calculator };",
        "isEntryPoint": false
      },
      {
        "filename": "logger.js",
        "code": "class Logger {\n    log(message) {\n        console.log(`[LOG] ${new Date().toISOString()}: ${message}`);\n    }\n}\n\nmodule.exports = { Logger };",
        "isEntryPoint": false
      }
    ],
    "saveMetric": true
  }'
```

#### **5. Error Handling Examples**

##### **Invalid Language**
```bash
curl -X POST http://localhost:3000/api/v1/execute \
  -H "Content-Type: application/json" \
  -d '{
    "language": "invalid_language",
    "code": "console.log(\"test\")",
    "saveMetric": false
  }'
```

##### **Missing Code**
```bash
curl -X POST http://localhost:3000/api/v1/execute \
  -H "Content-Type: application/json" \
  -d '{
    "language": "javascript",
    "saveMetric": false
  }'
```

##### **Code with Errors**
```bash
curl -X POST http://localhost:3000/api/v1/execute \
  -H "Content-Type: application/json" \
  -d '{
    "language": "python",
    "code": "print(\"Hello\")\nprint(undefined_variable)",
  "saveMetric": true
  }'
```

### **📝 Expected Response Format**

#### **Successful Execution**
```json
{
  "succeeded": true,
  "result": {
    "jobId": "abc123-def456-ghi789",
    "output": "Hello from RCE!\nCurrent time: Mon Jan 15 2024 10:30:00 GMT+0000 (UTC)",
    "errorMessage": null,
    "executionTime": 0.023,
    "memoryUsage": "2.1MB",
    "cpuUsage": "5.2%",
    "runTimeStatus": "succeeded"
  }
}
```

#### **Failed Execution**
```json
{
  "succeeded": true,
  "result": {
    "jobId": "abc123-def456-ghi789",
    "output": "",
    "errorMessage": "ReferenceError: undefined_variable is not defined",
    "executionTime": 0.015,
    "memoryUsage": "1.8MB",
    "cpuUsage": "3.1%",
    "runTimeStatus": "Error"
  }
}
```

#### **Invalid Request**
```json
{
  "succeeded": false,
  "errorMessage": "Invalid input"
}
```

### **🚀 Quick Test Script**

Create a test script to verify everything works:

```bash
#!/bin/bash
# test-rce-api.sh

echo "🧪 Testing RCE Code Execution API"
echo "================================="

# Test health check
echo "1. Testing health check..."
curl -s http://localhost:3000/health | jq '.'
echo ""

# Test JavaScript execution
echo "2. Testing JavaScript execution..."
curl -s -X POST http://localhost:3000/api/v1/execute \
  -H "Content-Type: application/json" \
  -d '{"language":"javascript","code":"console.log(\"Hello RCE!\")","saveMetric":false}' | jq '.'
echo ""

# Test Python execution
echo "3. Testing Python execution..."
curl -s -X POST http://localhost:3000/api/v1/execute \
  -H "Content-Type: application/json" \
  -d '{"language":"python","code":"print(\"Hello from Python!\")","saveMetric":false}' | jq '.'
echo ""

echo "✅ API testing complete!"
```

Make it executable and run:
```bash
chmod +x test-rce-api.sh
./test-rce-api.sh
```

### Response Format

```javascript
{
  "succeeded": true,
  "result": {
    "jobId": "uuid",
    "output": "Hello World",
    "errorMessage": null,
    "executionTime": 0.123,
    "memoryUsage": "2.5MB",
    "cpuUsage": "5.2%",
    "runTimeStatus": "succeeded"
  }
}
```

## 🔒 Security Features

### Container Security
- **Read-only filesystems** where possible
- **Resource limits** prevent DoS attacks
- **Automatic container cleanup** prevents resource leaks
- **No network access** from containers
- **Isolated execution** - each code run in separate container

### API Security
- **Input validation** and sanitization
- **Anonymous execution** - no user data stored
- **No persistent storage** in containers

### Privacy
- **No authentication required** - completely anonymous
- **No user tracking** - no personal data collected
- **Optional metrics** - only execution logs if enabled

## 📈 Optional Metrics & Logging

### Execution Metrics (Optional)
- **Execution time** tracking
- **Memory usage** monitoring
- **CPU utilization** measurement
- **Success/failure rates**
- **Error categorization**

### Database Schema (Optional)

```javascript
// Code execution log (only if saveMetric: true)
const codeExecution = new Schema({
  userId: String,           // Always "anonymous"
  language: String,
  code: String,
  output: String,
  errorMessage: String,
  executionTime: Number,
  memoryUsage: String,
  cpuUsage: String,
  runTimeStatus: String,
  projectId: String         // Always "default"
});
```

**Note**: Metrics are completely optional. Set `saveMetric: false` to disable logging entirely.

## 🚀 Deployment

### Simple Deployment

1. **Launch server** (AWS EC2, DigitalOcean, etc.)
2. **Install Docker and Node.js**
3. **Set up MongoDB** (optional - only for metrics)
4. **Deploy application**
5. **Configure reverse proxy** (nginx)

### Production Considerations

- **Load balancing** for multiple instances
- **Rate limiting** to prevent abuse
- **CloudWatch** for monitoring
- **Auto-scaling** based on demand
- **SSL/TLS** termination
- **Container registry** for Docker images

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Docker for containerization
- MongoDB for data storage
- Express.js for the web framework
- The open-source community

## 🚀 Quick Start

The server is ready to run! Here's how to get started:

```bash
# 1. Install dependencies
npm install

# 2. Build Docker images (first time only)
npm run build-docker

# 3. Start the server
npm start

# 4. Test the service
curl http://localhost:3000/health
```

### **Available Scripts**
- `npm start` - Start the production server
- `npm run dev` - Start with auto-restart (development)
- `npm run build-docker` - Build all Docker images

## 🎯 Benefits & Trade-offs

### **✅ What We Gain**

#### **🔒 Security**
- **Complete Isolation**: Each execution is completely sandboxed
- **No Data Persistence**: Nothing survives between executions
- **Resource Protection**: Host system is protected from malicious code
- **Anonymous**: No user data collection or tracking

#### **⚡ Performance**
- **Fast Startup**: Pre-built Docker images start quickly
- **Parallel Execution**: Multiple codes can run simultaneously
- **Resource Efficiency**: Containers are destroyed immediately after use
- **Language Optimization**: Each language gets appropriate resources

#### **🌐 Accessibility**
- **No Barriers**: No signup, authentication, or payment required
- **Simple API**: Just send code and get results
- **Multi-language**: Support for 6 popular programming languages
- **Cross-platform**: Works on any system with Docker

### **⚠️ Trade-offs We Accept**

#### **🚫 Limitations**
- **No Persistence**: Can't save files between executions
- **Resource Limits**: Memory and CPU constraints per execution
- **No Network Access**: Containers can't make external requests
- **Temporary**: Results are only available in the response

#### **🔧 Technical Constraints**
- **Docker Dependency**: Requires Docker to be installed and running
- **Image Management**: Need to maintain language-specific Docker images
- **Resource Monitoring**: Must track and limit resource usage
- **Container Overhead**: Each execution creates a new container

### **🎯 Perfect For**

- **Educational Platforms**: Students learning to code
- **Code Testing**: Automated testing of user submissions
- **Algorithm Benchmarking**: Comparing performance across languages
- **Prototyping**: Quick testing of code snippets
- **API Development**: Building code execution into larger systems

### **❌ Not Ideal For**

- **Long-running Applications**: No persistence between executions
- **Database Applications**: No persistent storage available
- **Network-dependent Code**: No external network access
- **Resource-intensive Tasks**: Strict memory and CPU limits
- **Production Applications**: Designed for testing, not production

## 🚀 Future Enhancements

### **Potential Improvements**
- **WebSocket Support**: Real-time execution streaming
- **Custom Time Limits**: User-configurable execution timeouts
- **More Languages**: Support for additional programming languages
- **File Upload**: Support for uploading multiple files
- **Execution History**: Optional execution logging and history
- **Rate Limiting**: Prevent abuse with request rate limits

### **Scaling Considerations**
- **Load Balancing**: Multiple server instances
- **Container Registry**: Centralized Docker image management
- **Monitoring**: Real-time system health monitoring
- **Auto-scaling**: Dynamic resource allocation based on demand

## 🔧 Troubleshooting

### **MongoDB Connection Issues**

If you see MongoDB timeout errors like:
```
MongooseError: Operation `codeexecutions.insertOne()` buffering timed out after 10000ms
```

**Solution**: The service works perfectly without MongoDB! Just run it without the `DB` environment variable:

```bash
# Run without MongoDB (recommended for testing)
npm start

# Or explicitly set no database
PORT=3000 npm start
```

### **Docker Issues**

If you see Docker-related errors:

```bash
# Check if Docker is running
docker --version
docker ps

# Build the Docker images first
npm run build-docker
```

### **Port Already in Use**

If port 3000 is already in use:

```bash
# Use a different port
PORT=3001 npm start
```

### **Common Issues**

1. **"Cannot find module" errors**: Run `npm install`
2. **Docker permission errors**: Add your user to docker group or use `sudo`
3. **Memory issues**: The service has built-in memory limits per execution
4. **Slow responses**: First execution might be slower due to Docker image building

---

**Note**: This is a simple, anonymous RCE service with Docker security. Perfect for educational purposes, testing, or as a building block for more complex systems. The architecture prioritizes security and simplicity over features and persistence.
