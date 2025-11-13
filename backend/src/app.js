import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import indexRoutes from "./routes/index.js";
import morgan from 'morgan'

// Khởi tạo app
const app = express();

// Kết nối database
import dbConnect from "./dbs/init.mongodb.js";
import initdb from "./dbs/import-mongo.js"; // Giả sử initdb không cần thiết trong production

// 💡 1. Tạo một biến để theo dõi trạng thái kết nối
let isConnected = false;

// 💡 2. Định nghĩa một hàm khởi tạo bất đồng bộ để đảm bảo kết nối
async function setupDatabase() {
  if (!isConnected) {
    try {
      await dbConnect(); // Đảm bảo await
      isConnected = true;
      console.log('✅ Database connection finalized.');

      // Xử lý initdb nếu cần, nhưng cẩn thận với thời gian khởi động function
      // if (process.env.NODE_ENV !== 'production') {
      //     await initdb();
      // }

    } catch (err) {
      console.error('❌ FATAL: Database setup failed.', err.message);
      // Trong môi trường Vercel, ném lỗi ở đây sẽ làm sập function, 
      // nhưng nó tốt hơn là để Mongoose ném lỗi giữa chừng.
      throw err;
    }
  }
}

// 💡 3. Middleware đảm bảo kết nối đã sẵn sàng cho mỗi request
app.use(async (req, res, next) => {
  // Gọi hàm setupDatabase() cho request đầu tiên của mỗi Function Instance
  if (!isConnected) {
    try {
      await setupDatabase();
    } catch (error) {
      // Nếu kết nối lỗi, trả về 503 để báo service không sẵn sàng
      return res.status(503).json({
        message: "Service Unavailable: Database connection failed.",
        error: error.message
      });
    }
  }
  next();
});

// Middleware
app.use(
  cors({
    origin: ['https://student-management-kohl-nine.vercel.app', 'http://localhost:5173'],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(morgan("tiny"));
app.use(bodyParser.json())

// Routes
app.use("/api/v1", indexRoutes);

// Middleware xử lý lỗi (vẫn ở cuối)
app.use((err, req, res, next) => {
  console.log("❌ Middleware error:", err.message);

  res.status(err.statusCode || 500).json({
    message: err.message || "Lỗi không xác định",
    errors: err.errors || [],
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

export default app;