// constants.js

export const ALLOWED_EMAIL_DOMAIN = "@student.hcmus.edu.vn";

export const PHONE_REGEX = /^(?:\+84|0)(3|5|7|8|9)[0-9]{8}$/;

export const STATUS_RULES = {
  active: ['active', 'graduated', 'dropout', 'suspended'],
  suspended: ["active"],
  graduated: [],
  dropout: [],
};

export const API_URL = 'http://localhost:3001/api/v1'