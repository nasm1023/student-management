db = db.getSiblingDB("StudentManagementSystem");

// Import students
db.Students.deleteMany({});  // Xóa dữ liệu cũ nếu có
db.Students.insertMany(JSON.parse(cat("/docker-entrypoint-initdb.d/StudentManagementSystem.Students.json")));

// Import departments
db.Departments.deleteMany({});
db.Departments.insertMany(JSON.parse(cat("/docker-entrypoint-initdb.d/StudentManagementSystem.Departments.json")));

// Import courses
db.Departments.deleteMany({});
db.Departments.insertMany(JSON.parse(cat("/docker-entrypoint-initdb.d/StudentManagementSystem.Courses.json")));

// Import registrations
db.Departments.deleteMany({});
db.Departments.insertMany(JSON.parse(cat("/docker-entrypoint-initdb.d/StudentManagementSystem.Registrations.json")));

// Import teachers
db.Departments.deleteMany({});
db.Departments.insertMany(JSON.parse(cat("/docker-entrypoint-initdb.d/StudentManagementSystem.Teachers.json")));

print("✅ Data imported successfully!");
