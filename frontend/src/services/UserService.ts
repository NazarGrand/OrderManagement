import api from "./AxiosService";

export const getAllUsers = async () => {
  return await api.get("/users");
};
