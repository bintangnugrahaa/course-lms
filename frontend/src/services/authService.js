import apiInstance from "../utils/axios";

export const postSignUp = (data) => apiInstance.post("/sign-up", data).then(res => res.data);
export const postSignIn = (data) => apiInstance.post("/sign-in", data).then(res => res.data);
