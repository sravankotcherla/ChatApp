import { axiosNode } from "./base.service";

export const AuthService = {
  signUp: async (params: {
    username: string;
    password: string;
    email: string;
  }) => {
    console.log(params);
    return axiosNode.post("/auth/signUp", params);
  },
  signIn: async (params: { username: string; password: string }) => {
    return axiosNode.get("/auth/signIn", { params: params });
  },
};
