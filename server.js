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
let mongoConnected = false;
if (process.env.DB) {
  try {
    await mongoose.connect(process.env.DB, {
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0 // Disable mongoose buffering
    });
    mongoConnected = true;
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.log('⚠️  MongoDB connection failed, running without database');
    console.log('   (Metrics logging will be disabled)');
    console.log('   Error:', error.message);
  }
} else {
  console.log('ℹ️  No MongoDB configured, running without database');
  console.log('   (Metrics logging will be disabled)');
}

// Routes
app.use('/', engineRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'RCE Code Execution Service',
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'RCE Code Execution Service',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      execute: '/api/v1/execute',
      executeMultiFile: '/api/v2/execute'
    },
    supportedLanguages: ['javascript', 'python', 'java', 'go', 'cpp', 'ruby'],
    documentation: 'See README.md for usage instructions'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    succeeded: false,
    errorMessage: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    succeeded: false,
    errorMessage: 'Endpoint not found',
    availableEndpoints: ['/health', '/api/v1/execute', '/api/v2/execute']
  });
});

app.listen(PORT, () => {
  console.log('🚀 RCE Code Execution Service started!');
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API docs: http://localhost:${PORT}/`);
  console.log('');
  console.log('🔧 Supported languages:');
  console.log('   • JavaScript (Node.js)');
  console.log('   • Python');
  console.log('   • Java');
  console.log('   • Go');
  console.log('   • C++');
  console.log('   • Ruby');
  console.log('');
  console.log('💡 Example usage:');
  console.log(`   curl -X POST http://localhost:${PORT}/api/v1/execute \\`);
  console.log('     -H "Content-Type: application/json" \\');
  console.log('     -d \'{"language":"javascript","code":"console.log(\\"Hello World\\")"}\'');
});
