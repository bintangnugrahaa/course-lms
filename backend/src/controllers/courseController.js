import courseModel from "../models/courseModel.js";
import fs from "fs";
import { mutateCourseSchema } from "../utils/schema.js";
import categoryModel from "../models/categoryModel.js";
import userModel from "../models/userModel.js";
import path from "path";
import courseDetailModel from "../models/courseDetailModel.js";

const serverError = (res) =>
  res.status(500).json({ message: "Internal server error" });

export const getCourses = async (req, res) => {
  try {
    const courses = await courseModel
      .find({ manager: req.user?._id })
      .select("name thumbnail")
      .populate({ path: "category", select: "name -_id" })
      .populate({ path: "students", select: "name" });

    const imageUrl = process.env.APP_URL + "/uploads/courses/";

    const response = courses.map((item) => ({
      ...item.toObject(),
      thumbnail_url: imageUrl + item.thumbnail,
      total_students: item.students.length,
    }));

    return res.json({
      message: "Get Courses Success",
      data: response,
    });
  } catch {
    return serverError(res);
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find();

    return res.json({
      message: "Get categories success",
      data: categories,
    });
  } catch {
    return serverError(res);
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const { preview } = req.query;

    const course = await courseModel
      .findById(id)
      .populate({ path: "category", select: "name -_id" })
      .populate({
        path: "details",
        select: preview === "true" ? "title type youtubeId text" : "title type",
      });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const imageUrl = process.env.APP_URL + "/uploads/courses/";

    return res.json({
      message: "Get Course Detail success",
      data: {
        ...course.toObject(),
        thumbnail_url: imageUrl + course.thumbnail,
      },
    });
  } catch {
    return serverError(res);
  }
};

export const postCourse = async (req, res) => {
  try {
    const parse = mutateCourseSchema.safeParse(req.body);

    if (!parse.success) {
      if (req?.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(400).json({
        message: "Validation error",
        errors: parse.error.issues.map((e) => e.message),
      });
    }

    const category = await categoryModel.findById(parse.data.categoryId);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const course = await courseModel.create({
      name: parse.data.name,
      category: category._id,
      description: parse.data.description,
      tagline: parse.data.tagline,
      thumbnail: req.file?.filename,
      manager: req.user._id,
    });

    await categoryModel.findByIdAndUpdate(category._id, {
      $push: { courses: course._id },
    });

    await userModel.findByIdAndUpdate(req.user._id, {
      $push: { courses: course._id },
    });

    return res.json({ message: "Create Course Success" });
  } catch {
    return serverError(res);
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const parse = mutateCourseSchema.safeParse(req.body);

    if (!parse.success) {
      if (req?.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(400).json({
        message: "Validation error",
        errors: parse.error.issues.map((e) => e.message),
      });
    }

    const category = await categoryModel.findById(parse.data.categoryId);
    const oldCourse = await courseModel.findById(id);

    if (!category || !oldCourse) {
      return res.status(404).json({ message: "Course or category not found" });
    }

    await courseModel.findByIdAndUpdate(id, {
      name: parse.data.name,
      category: category._id,
      description: parse.data.description,
      tagline: parse.data.tagline,
      thumbnail: req.file ? req.file.filename : oldCourse.thumbnail,
    });

    return res.json({ message: "Update Course Success" });
  } catch {
    return serverError(res);
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const course = await courseModel.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const filePath = path.join(
      path.resolve(),
      "public/uploads/courses",
      course.thumbnail
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await courseModel.findByIdAndDelete(course._id);

    return res.json({ message: "Delete course success" });
  } catch {
    return serverError(res);
  }
};

export const postContentCourse = async (req, res) => {
  try {
    const course = await courseModel.findById(req.body.courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const content = await courseDetailModel.create({
      title: req.body.title,
      type: req.body.type,
      course: course._id,
      text: req.body.text,
      youtubeId: req.body.youtubeId,
    });

    await courseModel.findByIdAndUpdate(course._id, {
      $push: { details: content._id },
    });

    return res.json({ message: "Create Content Success" });
  } catch {
    return serverError(res);
  }
};

export const updateContentCourse = async (req, res) => {
  try {
    const content = await courseDetailModel.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        type: req.body.type,
        text: req.body.text,
        youtubeId: req.body.youtubeId,
      },
      { new: true }
    );

    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    return res.json({ message: "Update Content Success" });
  } catch {
    return serverError(res);
  }
};

export const deleteContentCourse = async (req, res) => {
  try {
    const content = await courseDetailModel.findByIdAndDelete(req.params.id);

    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    return res.json({ message: "Delete Content Success" });
  } catch {
    return serverError(res);
  }
};

export const getDetailContent = async (req, res) => {
  try {
    const content = await courseDetailModel.findById(req.params.id);

    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    return res.json({
      message: "Get Detail Content success",
      data: content,
    });
  } catch {
    return serverError(res);
  }
};
