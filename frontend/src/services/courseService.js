import { apiInstanceAuth } from "../utils/axios";

export const getCourses = async () =>
  apiInstanceAuth.get("/courses").then((res) => res.data);
export const getCategories = async () =>
  apiInstanceAuth.get("/categories").then((res) => res.data);