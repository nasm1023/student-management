#!/bin/bash

DB_NAME=StudentManagementSystem
DATA_DIR=/mongo-seed  # Đường dẫn trong container

declare -A COLLECTIONS=(
  ["Departments"]="StudentManagementSystem.Departments.json"
  ["Students"]="StudentManagementSystem.Students.json"
  ["Courses"]="StudentManagementSystem.Courses.json"
  ["Teachers"]="StudentManagementSystem.Teachers.json"
  ["Registrations"]="StudentManagementSystem.Registrations.json"
  
)

echo "$(date +"%Y-%m-%d %H:%M:%S") ⏳ Importing data into MongoDB..."

for COLLECTION in "${!COLLECTIONS[@]}"; do
  DATA_FILE="$DATA_DIR/${COLLECTIONS[$COLLECTION]}"
  
  echo "$(date +"%Y-%m-%d %H:%M:%S") 📂 Importing $COLLECTION from $DATA_FILE..."

  mongoimport --db $DB_NAME --collection $COLLECTION --jsonArray --file $DATA_FILE --drop

  echo "$(date +"%Y-%m-%d %H:%M:%S") ✅ Imported $COLLECTION successfully!"
done

echo "$(date +"%Y-%m-%d %H:%M:%S") 🎉 All collections imported!"
