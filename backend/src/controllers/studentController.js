import userModel from "../models/userModel.js";
import courseModel from "../models/courseModel.js";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import { mutateStudentSchema } from "../utils/schema.js";
import mongoose from "mongoose";

const serverError = (res) =>
  res.status(500).json({ message: "Internal server error" });

export const getStudents = async (req, res) => {
  try {
    const students = await userModel
      .find({
        role: "student",
        manager: req.user._id,
      })
      .select("name courses photo");

    const photoUrl = process.env.APP_URL + "/uploads/students/";

    const response = students.map((item) => ({
      ...item.toObject(),
      photo_url: photoUrl + item.photo,
    }));

    return res.json({
      message: "Get Students success",
      data: response,
    });
  } catch {
    return serverError(res);
  }
};

export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid student id",
      });
    }

    const student = await userModel
      .findById(id)
      .select("name email");

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    return res.json({
      message: "Get detail student success",
      data: student,
    });
  } catch (error) {
    console.error(error);
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

export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const parse = mutateStudentSchema
      .partial({ password: true })
      .safeParse(req.body);

    if (!parse.success) {
      if (req?.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(400).json({
        message: "Validation error",
        errors: parse.error.issues.map((err) => err.message),
      });
    }

    const student = await userModel.findById(id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    const hashPassword = parse.data.password
      ? bcrypt.hashSync(parse.data.password, 12)
      : student.password;

    await userModel.findByIdAndUpdate(id, {
      name: parse.data.name,
      email: parse.data.email,
      password: hashPassword,
      photo: req.file ? req.file.filename : student.photo,
    });

    return res.json({
      message: "Update student success",
    });
  } catch {
    return serverError(res);
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await userModel.findById(id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    await courseModel.updateMany(
      { students: id },
      {
        $pull: { students: id },
      }
    );

    if (student.photo) {
      const filePath = path.join(
        path.resolve(),
        "public/uploads/students",
        student.photo
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await userModel.findByIdAndDelete(id);

    return res.json({
      message: "Delete student success",
    });
  } catch {
    return serverError(res);
  }
};
