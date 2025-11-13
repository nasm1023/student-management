import dotenv from 'dotenv'
dotenv.config()

import winston from "winston";
// Giữ lại 'winston-mongodb' nhưng sẽ cấu hình có điều kiện
import "winston-mongodb";

const connectString = process.env.MONGO_URI;

// 1. Định nghĩa các Transport cơ bản (luôn an toàn)
const transports = [
  new winston.transports.Console(), // An toàn: Log ra console (Vercel logs)
];

// 2. Chỉ thêm File Transport và MongoDB Transport trong môi trường DEVELOPMENT
// (Vì Vercel không cho phép ghi file, và việc khởi tạo MongoDB Transport 
// có thể gây crash Serverless Function)
if (process.env.NODE_ENV !== 'production') {
  // Chỉ chạy local/dev: Log vào file vật lý
  transports.push(
    new winston.transports.File({
      filename: "logs/app.log",
      level: "info"
    })
  );

  // Chỉ chạy local/dev: Log vào MongoDB
  // Chú ý: Việc khởi tạo MongoDB Transport ở đây vẫn có thể gây crash local 
  // nếu MONGO_URI chưa sẵn sàng, nhưng nó sẽ an toàn trên Vercel.
  if (connectString) {
    transports.push(
      new winston.transports.MongoDB({
        db: connectString,
        collection: "logs",
        level: "info",
        options: { useUnifiedTopology: true }
      })
    );
  }
}


// Cấu hình Winston
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: transports, // Sử dụng transports đã được lọc
});

// Middleware ghi log request
const requestLogger = (req, res, next) => {
  // Chỉ ghi log info nếu không phải production (vì log production có thể bị hạn chế)
  if (process.env.NODE_ENV !== 'production') {
    logger.info({
      message: "Incoming request",
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      timestamp: new Date().toISOString(),
    });
  }
  next();
};


// Bắt lỗi không xử lý được
// Giữ lại để bắt lỗi, nhưng chỉ dùng logger.error cho console
process.on("uncaughtException", (err) => {
  // 💡 CHỈ log ra console, KHÔNG dùng logger vì logger có thể chưa khởi tạo xong
  console.error("❌ FATAL: Uncaught Exception", { error: err.message, stack: err.stack });
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ FATAL: Unhandled Rejection", { reason, promise });
});

export { logger, requestLogger };