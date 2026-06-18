const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const { createServer } = require('http');
const WebSocket = require('ws');
const winston = require('winston');

// 환경변수 로드
dotenv.config();

// 로거 설정
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Express 앱 생성
const app = express();

// 미들웨어 설정
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 1000, // 최대 1000 요청
  message: 'Too many requests, please try again later.'
});
app.use('/api/', limiter);

// 로깅 미들웨어
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// API 라우트 (임시 - 나중에 분리)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 라우트 임포트 (나중에 구현)
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/users', require('./routes/users'));
// app.use('/api/drones', require('./routes/drones'));
// app.use('/api/missions', require('./routes/missions'));
// app.use('/api/telemetry', require('./routes/telemetry'));

// 404 핸들링
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// 에러 핸들링
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

// HTTP 서버 생성
const server = createServer(app);

// WebSocket 설정
const wss = new WebSocket.Server({ 
  server,
  path: process.env.WS_PATH || '/ws'
});

wss.on('connection', (ws) => {
  logger.info('WebSocket client connected');
  
  ws.on('message', (data) => {
    logger.debug(`Received: ${data}`);
    // 메시지 처리 로직 추가 예정
  });
  
  ws.on('close', () => {
    logger.info('WebSocket client disconnected');
  });
  
  ws.on('error', (err) => {
    logger.error(`WebSocket error: ${err}`);
  });
});

// 서버 시작
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  logger.info(`🚀 SOONDRONE GCS Backend Server running on port ${PORT}`);
  logger.info(`📊 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
