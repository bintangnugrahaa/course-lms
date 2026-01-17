import userModel from "../models/userModel.js";

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
  } catch (error) {
    return serverError(res);
  }
};
