import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import fs from "fs";
import { mutateStudentSchema } from "../utils/schema.js";

const serverError = (res) =>
  res.status(500).json({ message: "Internal server error" });

export const getStudents = async (req, res) => {
  try {
    const students = await userModel.find({
      role: "student",
      manager: req.user._id,
    });

    return res.json({
      message: "Get Students success",
      data: students,
    });
  } catch {
    return serverError(res);
  }
};

export const postStudent = async (req, res) => {
  try {
    const parse = mutateStudentSchema.safeParse(req.body);

    if (!parse.success) {
      if (req?.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(400).json({
        message: "Validation error",
        errors: parse.error.issues.map((err) => err.message),
      });
    }

    const hashPassword = bcrypt.hashSync(parse.data.password, 12);

    const student = new userModel({
      name: parse.data.name,
      email: parse.data.email,
      password: hashPassword,
      photo: req.file?.filename,
      manager: req.user._id,
      role: "student",
    });

    await student.save();

    return res.json({
      message: "Create student success",
    });
  } catch {
    return serverError(res);
  }
};
