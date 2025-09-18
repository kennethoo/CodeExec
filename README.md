# CodeExec RCE - Anonymous Code Execution Service

A simple, secure, and **anonymous** Remote Code Execution (RCE) service that allows anyone to execute code in multiple programming languages through Docker-isolated containers. No authentication required!

## 🎯 Overview

CodeExec RCE is a **free** and **anonymous** code execution service that provides:
- **Secure code execution** in isolated Docker containers
- **Multi-language support** (JavaScript, Python, Java, Go, C++, Ruby)
- **Resource management** with memory and CPU limits
- **Anonymous execution** - no user accounts or authentication needed
- **Execution metrics** and logging (optional)

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

5. **Create the missing server.js file** (see below)

### Environment Variables

```env
DB=mongodb://localhost:27017/codeexec  # Optional - only for metrics
PORT=3000                              # Server port
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

## ⚠️ Missing Server File

The main `server.js` file is missing from this repository. You'll need to create it to run the service:

```javascript
// server.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import engineRouter from './router/engineRouter.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Connect to MongoDB (optional)
if (process.env.DB) {
  mongoose.connect(process.env.DB);
}

// Routes
app.use('/', engineRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 CodeExec RCE server running on port ${PORT}`);
});
```

---

**Note**: This is a simple, anonymous RCE service with Docker security. Perfect for educational purposes, testing, or as a building block for more complex systems.
