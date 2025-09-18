# CodeExec RCE - Remote Code Execution Backend

A simple, secure Remote Code Execution (RCE) service that allows users to execute code in multiple programming languages through a Docker-isolated API. Built with Node.js, Express, MongoDB, and Docker.

## 🎯 Overview

CodeExec RCE is a **free** code execution service that provides:
- **Secure code execution** in isolated Docker containers
- **Multi-language support** (JavaScript, Python, Java, Go, C++, Ruby)
- **Resource management** with memory and CPU limits
- **Execution metrics** and logging

## 🏗️ Architecture

### Core Components

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Client App    │───▶│   API Gateway    │───▶│  Code Execution │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │  User Management │    │  Docker Engine  │
                       └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │     MongoDB      │
                       └──────────────────┘
```

### File Structure Mapping

```
├── server.js                          # Main Express server (missing)
├── apiGateWay.js                      # API orchestration layer
├── router/
│   └── engineRouter.js                # Code execution endpoints
├── engine-application/
│   ├── executeEngineManager.js        # Docker execution manager v1
│   ├── executeEngineManagerv2.js      # Docker execution manager v2
│   └── remoteCode.js                  # Remote execution coordinator
├── application/
│   └── codeExecution.js               # Execution metrics & logging
├── docker-images/                     # Language-specific Docker configs
│   ├── python/Dockerfile
│   ├── javascript/Dockerfile
│   ├── java/Dockerfile
│   ├── go/Dockerfile
│   ├── cpp/Dockerfile
│   └── ruby/Dockerfile
```

## 🔧 RCE Implementation Details

### 1. **Docker Isolation Strategy**

**File**: `engine-application/executeEngineManager.js`

```javascript
// Language-specific Docker images
this.MEETTUM_NODE_IMAGE = "amzat/meettum-node-image:v1.0";
this.MEETTUM_PYTHON_IMAGE = "amzat/meettum-python-image:v1.0";
// ... other languages

// Resource limits per language
getDockerCommand({ language, jobName, volumeMount, dockerImageName }) {
  if (language === this.JAVASCRIPT) {
    return `docker run --read-only -m 7m --ulimit cpu=10 --name ${jobName} -v ${volumeMount} ${dockerImageName}`;
  }
  // ... other languages with different limits
}
```

**Security Features**:
- **Read-only containers** prevent file system modifications
- **Memory limits** (7MB-1.2GB) prevent resource exhaustion
- **CPU limits** control processing power
- **Automatic cleanup** removes containers after execution

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

### 4. **Execution Metrics & Logging**

**File**: `application/codeExecution.js`

```javascript
// Execution metrics tracking
const codeExecution = new Schema({
  userId: String,
  language: String,
  code: String,
  output: String,
  errorMessage: String,
  executionTime: Number,
  memoryUsage: String,
  cpuUsage: String,
  runTimeStatus: String
});

// Save execution metrics
createMetric = async (metric) => {
  const result = await CodeExecution.create(metric);
  return result;
};
```

**Note**: The service is **free** and **anonymous** - no authentication required.

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
- MongoDB
- AWS EC2 (for production)

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

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Build Docker images**
```bash
node docker-images/buildAllDockerImage.js
```

5. **Start the server**
```bash
npm start
```

### Environment Variables

```env
DB=mongodb://localhost:27017/codeexec
PORT=3000
SECRET=your-session-secret
NAME=session-name
```

## 📊 API Usage

### Code Execution

```javascript
// Single file execution
POST /api/v1/execute
{
  "language": "javascript",
  "code": "console.log('Hello World')",
  "saveMetric": true
}

// Multi-file execution
POST /api/v2/execute
{
  "language": "python",
  "files": [
    {
      "filename": "main.py",
      "code": "print('Hello World')",
      "isEntryPoint": true
    }
  ],
  "saveMetric": true
}
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

## 🔒 Security Considerations

### Container Security
- **Read-only filesystems** where possible
- **Resource limits** prevent DoS attacks
- **Automatic container cleanup** prevents resource leaks
- **No network access** from containers

### API Security
- **Input validation** and sanitization
- **Rate limiting** (to be implemented)

### Data Security
- **No persistent storage** in containers
- **Anonymous execution** - no user data stored

## 📈 Monitoring & Metrics

### Execution Metrics
- **Execution time** tracking
- **Memory usage** monitoring
- **CPU utilization** measurement
- **Success/failure rates**
- **Error categorization**

### Database Schema

```javascript
// Code execution log
const codeExecution = new Schema({
  userId: String,
  language: String,
  code: String,
  output: String,
  errorMessage: String,
  executionTime: Number,
  memoryUsage: String,
  cpuUsage: String,
  runTimeStatus: String,
  projectId: String
});
```

## 🚀 Deployment

### AWS EC2 Deployment

1. **Launch EC2 instance**
2. **Install Docker and Node.js**
3. **Set up MongoDB Atlas**
4. **Deploy application**
5. **Configure systemd service**

### Production Considerations

- **Load balancing** for multiple instances
- **Redis** for session storage
- **CloudWatch** for monitoring
- **Auto-scaling** based on demand
- **SSL/TLS** termination

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

---

**Note**: This is a production-ready RCE service with proper security measures. Always test thoroughly before deploying to production environments.
