import { User } from "../common/interfaces/User";
import api from "./AxiosService";

export const getAllUsers = async (): Promise<User[]> => {
  const response = await api.get("/users");
  return response.data;
};
