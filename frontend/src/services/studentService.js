import { apiInstanceAuth } from "../utils/axios";

export const getStudents = () => apiInstanceAuth.get("/students").then(res => res.data);

export const getDetailStudent = (id) =>
    apiInstanceAuth.get(`/students/${id}`).then(res => res.data);

export const createStudent = (data) =>
    apiInstanceAuth.post("/students", data, { headers: { "Content-Type": "multipart/form-data" } }).then(res => res.data);

export const updateStudent = (data, id) =>
    apiInstanceAuth.put(`/students/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } }).then(res => res.data);

export const deleteStudent = (id) =>
    apiInstanceAuth.delete(`/students/${id}`).then(res => res.data);
