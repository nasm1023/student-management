import { Schema, model } from 'mongoose';

const COLLECTION_NAME = 'Teachers';

const teacherSchema = new Schema(
  {
    teacherId: {
      type: String,
      unique: true,
      required: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    gender: {
      type: Boolean, // true: male, false: female
      required: true,
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: 'departments',
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: [
        'lecturer',               // Giảng viên
        'teacher',                // Giáo viên
        'faculty_academic_officer', // Giáo vụ khoa
        'student_affairs_officer',  // Cán bộ công tác sinh viên
        'academic_advisor',       // Giáo viên hướng dẫn
        'teaching_assistant'      // Trợ giảng
      ],
      required: true
    },
    academicDegree: {
      type: String,
      enum: [
        'Intermediate',
        'College',
        'Bachelor',
        'Engineer',
        'Master',
        'PhD',
        'DSc',
        'AssociateProfessor',
        'Professor'
      ],
      required: true,
    },
    address: {
      houseNumber: String,
      street: String,
      ward: String,
      district: String,
      city: String,
      country: String,
    },
    addressMail: {
      houseNumber: String,
      street: String,
      ward: String,
      district: String,
      city: String,
      country: String,
    },
    identityDocument: {
      type: {
        type: String,
        enum: ['CMND', 'CCCD', 'Passport'],
        required: true,
      },
      idNumber: {
        type: String,
        required: true,
      },
      issuedDate: {
        type: Date,
        required: true,
      },
      issuedPlace: {
        type: String,
        required: true,
      },
      expirationDate: {
        type: Date,
      },
      hasChip: {
        type: Boolean,
      },
      countryIssued: {
        type: String,
      },
      notes: {
        type: String,
      },
    },
    nationality: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// Validate logic for identityDocument fields
teacherSchema.pre('validate', function (next) {
  const doc = this;
  const idDoc = doc.identityDocument;

  if (idDoc.type === 'CCCD') {
    if (!idDoc.expirationDate) {
      doc.invalidate('identityDocument.expirationDate', 'expirationDate is required for CCCD');
    }
    if (idDoc.hasChip === undefined) {
      doc.invalidate('identityDocument.hasChip', 'hasChip is required for CCCD');
    }
  }

  if (idDoc.type === 'Passport') {
    if (!idDoc.countryIssued) {
      doc.invalidate('identityDocument.countryIssued', 'countryIssued is required for Passport');
    }
  }

  next();
});

const teacherModel = model(COLLECTION_NAME, teacherSchema);
export default teacherModel;
