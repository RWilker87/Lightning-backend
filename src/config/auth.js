// src/config/auth.js

export default {
  secret: process.env.JWT_SECRET,
  expiresIn: "1h",
};