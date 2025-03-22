import { Order } from "../common/interfaces/Order";
import api from "./AxiosService";

export const getUserOrders = async (userId: string) => {
  return await api.get(`/orders/${userId}`);
};

export const createOrder = async (order: Order) => {
  return await api.post("/orders", order);
};
