import { apiInstanceAuth } from "../utils/axios";

export const getStudents = async () => apiInstanceAuth.get("/students").then(res => res.data);
export const createStudent = async (data) => apiInstanceAuth.post("/students", data, { headers: { "Content-Type": "multipart/form-data", }, }).then((res) => res.data)