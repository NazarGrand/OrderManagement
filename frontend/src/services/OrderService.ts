import { OrderRequest } from "../common/interfaces/OrderRequest";
import api from "./AxiosService";

export const getUserOrders = async (userId: string) => {
  return await api.get(`/orders/${userId}`);
};

export const createOrder = async (order: OrderRequest) => {
  return await api.post("/orders", order);
};
