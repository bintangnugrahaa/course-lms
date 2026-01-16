import mongoose from "mongoose";

export default async function connectDB() {
  const DATABASE_URL = process.env.DATABASE_URL ?? "";

  if (!DATABASE_URL) {
    process.exit(1);
  }

  try {
    await mongoose.connect(DATABASE_URL);
  } catch {
    process.exit(1);
  }

  mongoose.connection.on("error", () => {
    process.exit(1);
  });
}
