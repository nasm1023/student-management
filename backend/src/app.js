import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import indexRoutes from "./routes/index.js";
import morgan from 'morgan'
// Khởi tạo app
const app = express();
// Kết nối database
import dbConnect from "./dbs/init.mongodb.js";
import initdb from "./dbs/import-mongo.js";

dbConnect()
  .then(async (mongooseInstance) => {
    console.log('✅ Database Connected Successfully!');

    const db = mongooseInstance.connection.db;

    // 👉 Check if a known collection (e.g. "users") already exists
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    if (collectionNames.includes('users')) {
      console.log('⚠️ Database already initialized — skipping initdb()');
      return;
    }

    console.log('🚀 Initializing database for the first time...');
    await initdb();
    console.log('✅ Database Initialized Successfully!');
  })
  .catch((err) => {
    console.error('❌ Database connection or initialization failed:', err);
  });

// Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(morgan("tiny"));
app.use(bodyParser.json())



// Routes
// app.use(jsonErrorHandler)
app.use("/api/v1", indexRoutes);
app.use((err, req, res, next) => {
  console.log("❌ Middleware error:", err.message);

  res.status(err.statusCode || 500).json({
    message: err.message || "Lỗi không xác định",
    errors: err.errors || [],
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});
export default app;
