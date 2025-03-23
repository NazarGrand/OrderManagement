import { OrderRequest } from "../common/interfaces/OrderRequest";
import { OrdersResponse } from "../common/interfaces/OrderResponse";
import api from "./AxiosService";

export const getUserOrders = async (
  userId: string
): Promise<OrdersResponse> => {
  const response = await api.get(`/orders/${userId}`);
  return response.data;
};

export const createOrder = async (order: OrderRequest) => {
  return await api.post("/orders", order);
};
