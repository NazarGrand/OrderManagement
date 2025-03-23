import { Product } from "../common/interfaces/Product";
import api from "./AxiosService";

export const getAllProducts = async (): Promise<Product[]> => {
  const response = await api.get("/products");
  return response.data;
};
