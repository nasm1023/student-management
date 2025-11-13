// lib/dbConnect.js

import mongoose from 'mongoose';
// Import thư viện Vercel Functions
import { attachDatabasePool } from '@vercel/functions';

// Lấy chuỗi kết nối Atlas từ biến môi trường
const connectString = process.env.MONGO_URI;

// Khởi tạo biến cached để lưu trữ kết nối
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Hàm kết nối Serverless MongoDB/Mongoose
 * @returns {Promise<mongoose.Connection>}
 */
async function dbConnect() {
    if (!connectString) {
        throw new Error('Please define the MONGO_URI environment variable inside .env');
    }
    
    // 1. Nếu đã có kết nối, trả về kết nối đã cache
    if (cached.conn) {
        return cached.conn;
    }

    // 2. Nếu không có promise, tạo promise kết nối mới
    if (!cached.promise) {
        const opts = {
            bufferCommands: false, // Tắt buffer command vì là Serverless
            maxPoolSize: 1,        // Giảm maxPoolSize là best practice cho Serverless (thường là 1)
            // ... các options khác nếu cần
        };
        
        cached.promise = mongoose.connect(connectString, opts).then((mongooseInstance) => {
            // Lấy Client MongoDB gốc từ Mongoose
            const client = mongooseInstance.connection.getClient(); 
            
            // 💡 ÁP DỤNG HÀM TỐI ƯU CỦA VERCEL
            // Gắn client vào pool quản lý của Vercel Functions
            attachDatabasePool(client);
            
            return mongooseInstance;
        });
    }
    
    // 3. Chờ kết nối hoàn tất và gán vào cache
    try {
        cached.conn = await cached.promise;
    } catch (e) {
        // Nếu kết nối lỗi, xóa promise để thử lại
        cached.promise = null; 
        throw e;
    }

    // Trả về kết nối Mongoose đã sẵn sàng
    return cached.conn;
}

export default dbConnect;