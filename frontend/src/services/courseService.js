import { apiInstanceAuth } from "../utils/axios";

export const getCourses = () => apiInstanceAuth.get("/courses").then(res => res.data);

export const getCourseDetail = (id, isPreview = false) =>
  apiInstanceAuth.get(`/courses/${id}${isPreview ? "?preview=true" : ""}`).then(res => res.data);

export const getCategories = () => apiInstanceAuth.get("/categories").then(res => res.data);

export const createCourse = (data) =>
  apiInstanceAuth.post("/courses", data, { headers: { "Content-Type": "multipart/form-data" } }).then(res => res.data);

export const updateCourse = (data, id) =>
  apiInstanceAuth.put(`/courses/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } }).then(res => res.data);

export const deleteCourse = (id) =>
  apiInstanceAuth.delete(`/courses/${id}`).then(res => res.data);

export const createContent = (data) =>
  apiInstanceAuth.post("/courses/contents", data).then(res => res.data);

export const getDetailContent = (id) =>
  apiInstanceAuth.get(`/courses/contents/${id}`).then(res => res.data);

export const updateContent = (data, id) =>
  apiInstanceAuth.put(`/courses/contents/${id}`, data).then(res => res.data);

export const deleteDetailContent = (id) =>
  apiInstanceAuth.delete(`/courses/contents/${id}`).then(res => res.data);

export const getStudentsCourse = async (id) =>
  apiInstanceAuth.get(`/courses/students/${id}`).then(res => res.data)

export const addStudentsCourse = async (data, id) =>
  apiInstanceAuth.post(`/courses/students/${id}`, data).then(res => res.data)