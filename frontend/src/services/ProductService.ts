import api from "./AxiosService";

export const getAllProducts = async () => {
  return await api.get("/products");
};
