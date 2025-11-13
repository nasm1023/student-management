import fs from 'fs/promises';
import path from 'path';
import studentModel from '../models/student.model.js'
import Course from '../models/course.model.js';
import departmentModel from '../models/department.model.js'
import teacherModel from '../models/teacher.model.js';
import Registrations from '../models/registration.model.js'
import { EJSON } from 'bson'
import { error } from 'console';

async function initdb() {
    const dataDir = path.resolve(process.cwd(), "src/mongo-seed");
    try {
        // 1. STUDENTS
        const studentData = await fs.readFile(path.join(dataDir, "StudentManagementSystem.Students.json"), 'utf-8');
        await studentModel.deleteMany({});
        await studentModel.insertMany(JSON.parse(studentData));

        console.log("✅ Student data successfully!");

        // 2. DEPARTMENTS
        const departmentData = await fs.readFile(path.join(dataDir, "StudentManagementSystem.Departments.json"), 'utf-8');
        await departmentModel.deleteMany({});
        await departmentModel.insertMany(JSON.parse(departmentData));

        console.log("✅ Department data successfully!");

        // 3. Courses
        const coursesData = await fs.readFile(path.join(dataDir, "StudentManagementSystem.Courses.json"), 'utf-8');
        const coursesArray = JSON.parse(coursesData);
        await Course.deleteMany({});
        // await Course.insertMany(JSON.parse(coursesData));

        for (const data of coursesArray) {
            try {
                // Sử dụng save() để kích hoạt validation (bao gồm cả validation custom của bạn)
                const newCourse = new Course(data);
                await newCourse.save();
                console.log(`Đã chèn thành công: ${data.courseId}`);
            } catch (error) {
                console.error(`Lỗi khi chèn ${data.courseId}:`, error.message);
                // Nếu lỗi xảy ra ở đây, đó là do validation
                // Nhưng do đã sắp xếp thứ tự, lỗi này chỉ xảy ra nếu có lỗi khác (ví dụ: duplicate courseId)
            }
        }

        console.log("✅ Courses data successfully!");

        // 4. Teacher
        const teachersData = await fs.readFile(path.join(dataDir, "StudentManagementSystem.Teachers.json"), 'utf-8');
        await teacherModel.deleteMany({});
        await teacherModel.insertMany(JSON.parse(teachersData));

        // for (const data of teachersData)
        //     try {
        //         const teacher = new teacherModel(data)
        //         await teacher.save();
        //     }
        //     catch (error) {
        //         console.log("error while insert teacher", error);
        //     }

        console.log("✅ Teacher data successfully!");

        // 5. Registeration
        const registerationData = await fs.readFile(path.join(dataDir, "StudentManagementSystem.Registerations.json"), 'utf-8');
        await Registrations.deleteMany({});
        await Registrations.insertMany(JSON.parse(registerationData));

        console.log("✅ Registeration data successfully!");

        console.log("✅ Data imported successfully!");
    } catch (error) {
        console.error("❌ Error during database initialization:", error);
    }
}

export default initdb;