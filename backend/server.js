const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// 1. Startup validation (validate env variables first)
const validateEnv = require('./config/envValidator');
validateEnv();

// Load logger and db pool
const logger = require('./config/logger');
const pool = require('./config/db');
const requestTimeout = require('./middlewares/timeout');
const errorHandler = require('./middlewares/errorHandler');
const apiRoutes = require('./routes');

// 2. Capture unexpected errors on Node process
process.on('uncaughtException', (err) => {
  logger.critical('CRITICAL UNCAUGHT EXCEPTION:', err);
  if (err.code === 'EADDRINUSE' || err.syscall === 'listen') {
    process.exit(1);
  }
});

const compression = require('compression');
const app = express();
const PORT = process.env.PORT || 5050;

// 3. Security & Performance Middlewares
app.use(compression());
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-HTTP-Method-Override', 'X-Requested-With', 'Accept', 'Origin']
}));
app.options('*', cors());

// 4. Centralized Request Logging via Morgan redirected to logger
app.use(morgan(':method :url :status :res[content-length] - :response-time ms', {
  stream: {
    write: (message) => logger.info(`HTTP Request: ${message.trim()}`)
  }
}));

// 5. Request Timeout Middleware (30s)
app.use(requestTimeout(30000));

// Payload Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve static assets
app.use('/public', express.static(path.join(__dirname, 'public'), { maxAge: '7d' }));

// 6. GET /health (Public Endpoint)
app.get('/health', async (req, res) => {
  const dbHealth = await pool.checkDbHealth();
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();

  const isHealthy = dbHealth.status === 'healthy';

  res.status(isHealthy ? 200 : 503).json({
    success: isHealthy,
    status: isHealthy ? 'UP' : 'DOWN',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: `${Math.floor(uptime)}s`,
    database: dbHealth,
    system: {
      memory: {
        rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
        heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
        heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system
      }
    }
  });
});

// Root Check Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ReachSkyline ERP Admin API is active.',
    data: { version: '1.0.0' },
    errors: []
  });
});

// ==============================================================================
// ⚡ HARD-DELETE & EDIT POST ALIASES (Bypasses LiteSpeed WAF PUT & DELETE 403 blocks)
// ==============================================================================

// 1. MANAGERS
app.post('/api/users/managers/:id/delete', (req, res, next) => {
  req.url = `/users/managers/${req.params.id}`;
  req.method = 'DELETE';
  apiRoutes(req, res, next);
});

app.post('/api/users/managers/:id/update', (req, res, next) => {
  req.url = `/users/managers/${req.params.id}`;
  req.method = 'PUT';
  apiRoutes(req, res, next);
});

// 2. EMPLOYEES
app.post('/api/users/employees/:id/delete', (req, res, next) => {
  req.url = `/users/employees/${req.params.id}`;
  req.method = 'DELETE';
  apiRoutes(req, res, next);
});

app.post('/api/users/employees/:id/update', (req, res, next) => {
  req.url = `/users/employees/${req.params.id}`;
  req.method = 'PUT';
  apiRoutes(req, res, next);
});

// 3. CLIENTS
app.post('/api/clients/:id/delete', (req, res, next) => {
  req.url = `/clients/${req.params.id}`;
  req.method = 'DELETE';
  apiRoutes(req, res, next);
});

app.post('/api/clients/:id/update', (req, res, next) => {
  req.url = `/clients/${req.params.id}`;
  req.method = 'PUT';
  apiRoutes(req, res, next);
});

// 4. DEPARTMENTS
app.post('/api/departments/:id/delete', (req, res, next) => {
  req.url = `/departments/${req.params.id}`;
  req.method = 'DELETE';
  apiRoutes(req, res, next);
});

app.post('/api/departments/:id/update', (req, res, next) => {
  req.url = `/departments/${req.params.id}`;
  req.method = 'PUT';
  apiRoutes(req, res, next);
});

// 5. JOB WORK & DELIVERABLE ASSIGNMENT, SUBMISSION, & REVIEWS
app.post('/api/deliverables/job-work/:id/assign', (req, res, next) => {
  req.url = `/deliverables/job-work/${req.params.id}/assign`;
  req.method = 'PUT';
  apiRoutes(req, res, next);
});

app.post('/api/deliverables/job-work/:id/review', (req, res, next) => {
  req.url = `/deliverables/job-work/${req.params.id}/review`;
  req.method = 'PUT';
  apiRoutes(req, res, next);
});

app.post('/api/deliverables/:id/assign', (req, res, next) => {
  req.url = `/deliverables/${req.params.id}/assign`;
  req.method = 'PUT';
  apiRoutes(req, res, next);
});

app.post('/api/deliverables/:id/submit', (req, res, next) => {
  req.url = `/deliverables/${req.params.id}/submit`;
  req.method = 'PUT';
  apiRoutes(req, res, next);
});

app.post('/api/deliverables/:id/review', (req, res, next) => {
  req.url = `/deliverables/${req.params.id}/review`;
  req.method = 'PUT';
  apiRoutes(req, res, next);
});

app.post('/api/deliverables/:id/client-review', (req, res, next) => {
  req.url = `/deliverables/${req.params.id}/client-review`;
  req.method = 'PUT';
  apiRoutes(req, res, next);
});

app.post('/api/deliverables/:id/manager-client-review', (req, res, next) => {
  req.url = `/deliverables/${req.params.id}/manager-client-review`;
  req.method = 'PUT';
  apiRoutes(req, res, next);
});

app.post('/api/deliverables/:id/status', (req, res, next) => {
  req.url = `/deliverables/${req.params.id}/status`;
  req.method = 'PATCH';
  apiRoutes(req, res, next);
});

// 6. EVENT DAYS
app.post('/api/event-days/:id/delete', (req, res, next) => {
  req.url = `/event-days/${req.params.id}`;
  req.method = 'DELETE';
  apiRoutes(req, res, next);
});

app.post('/api/event-days/:id/update', (req, res, next) => {
  req.url = `/event-days/${req.params.id}`;
  req.method = 'PUT';
  apiRoutes(req, res, next);
});

// 7. CONTENT & BLOG CALENDARS
app.post('/api/calendar/:id/delete', (req, res, next) => {
  req.url = `/calendar/${req.params.id}`;
  req.method = 'DELETE';
  apiRoutes(req, res, next);
});

app.post('/api/calendar/month/:month/delete', (req, res, next) => {
  req.url = `/calendar/month/${req.params.month}`;
  req.method = 'DELETE';
  apiRoutes(req, res, next);
});

app.post('/api/blog-calendar/:id/delete', (req, res, next) => {
  req.url = `/blog-calendar/${req.params.id}`;
  req.method = 'DELETE';
  apiRoutes(req, res, next);
});

app.post('/api/blog-calendar/month/:month/delete', (req, res, next) => {
  req.url = `/blog-calendar/month/${req.params.month}`;
  req.method = 'DELETE';
  apiRoutes(req, res, next);
});

// ==============================================================================

// Register API Routes (support both /api and fallback /api/api)
app.use('/api/api', apiRoutes);
app.use('/api', apiRoutes);

// 404 Route handler
app.use((req, res, next) => {
  const err = new Error(`Cannot find requested route ${req.originalUrl} on this server.`);
  err.statusCode = 404;
  next(err);
});

// Centralized Error Handler Middleware
app.use(errorHandler);

let server;

// Helper to free occupied port in development mode
function killPortProcess(port) {
  if (process.env.NODE_ENV === 'production') {
    return;
  }
  try {
    const isWin = process.platform === 'win32';
    if (isWin) {
      const output = require('child_process').execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
      const lines = output.trim().split('\n');
      const pids = new Set();
      lines.forEach(line => {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && pid !== '0' && pid !== `${process.pid}`) {
          pids.add(pid);
        }
      });
      pids.forEach(pid => {
        try {
          require('child_process').execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
          logger.info(`[AutoKillPort] Terminated stale process PID ${pid} occupying port ${port}`);
        } catch (_) {}
      });
    } else {
      require('child_process').execSync(`fuser -k ${port}/tcp`, { stdio: 'ignore' });
    }
  } catch (_) {
    // Ignore error if no process found
  }
}

// 7. Express Startup waits for DB Connection
async function startServer(retryCount = 0) {
  try {
    await pool.connectWithRetry();

    server = app.listen(PORT);
    server.keepAliveTimeout = 65000;
    server.headersTimeout = 66000;

    server.on('listening', () => {
      logger.info(`==================================================`);
      logger.info(`ERP Admin Backend Server is running in ${process.env.NODE_ENV || 'development'} mode.`);
      logger.info(`Local Access URL: http://localhost:${PORT}`);
      logger.info(`==================================================`);
    });

    server.on('error', (err) => {
      const isDev = (process.env.NODE_ENV || 'development') === 'development';
      if (err.code === 'EADDRINUSE') {
        logger.warn(`Port ${PORT} is currently in use.`);
        if (isDev && retryCount < 2) {
          logger.info(`[Development Mode] Clearing stale process on port ${PORT} and retrying...`);
          killPortProcess(PORT);
          setTimeout(() => {
            startServer(retryCount + 1);
          }, 1000);
          return;
        }
      }
      logger.critical('CRITICAL SERVER LISTEN ERROR:', err);
      process.exit(1);
    });
  } catch (err) {
    logger.critical('Failed to initialize database pool on startup. Node is shutting down.', err);
    process.exit(1);
  }
}

startServer();

// 8. Graceful Shutdown Handler
const gracefulShutdown = async (signal) => {
  logger.info(`Received ${signal}. Initiating graceful shutdown...`);
  
  if (server) {
    try {
      if (typeof server.closeAllConnections === 'function') {
        server.closeAllConnections();
      }
    } catch (_) {}

    server.close(() => {
      logger.info('HTTP server closed.');
      
      pool.end()
        .then(() => {
          logger.info('Database pool closed.');
          process.exit(0);
        })
        .catch(err => {
          logger.error('Error closing database pool:', err);
          process.exit(1);
        });
    });

    setTimeout(() => {
      logger.critical('Forced shutdown: active connections hung.');
      process.exit(0);
    }, 2000).unref();
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));