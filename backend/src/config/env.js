import "dotenv/config";

/**
 * Single place every other file reads environment variables from.
 * Mirrors TechCare's config/env.js (`ENV.*`) convention.
 */
export const ENV = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: process.env.DATABASE_URL || "",
  JWT_SECRET: process.env.JWT_SECRET || "dev-secret-change-me",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
  CENTRE_NAME: process.env.HEALTHTRACK_CENTRE_NAME || "Barangay Health Center of Mambog I",
  CENTRE_BARANGAY: process.env.HEALTHTRACK_BARANGAY || "Mambog I",
  CENTRE_MUNICIPALITY: process.env.HEALTHTRACK_MUNICIPALITY || "Bacoor",
  CENTRE_PROVINCE: process.env.HEALTHTRACK_PROVINCE || "Cavite",
  CORS_ORIGINS: process.env.CORS_ORIGINS?.split(",").map((origin) => origin.trim()) || [],
};
