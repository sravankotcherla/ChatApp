import { axiosNode } from "./base.service";

export const UserServices = {
  searchUsers: (params: { searchText: string }) => {
    return axiosNode.get("/users/search/", { params });
  },
  getSession: () => {
    return axiosNode.get("/users/session");
  },
};
