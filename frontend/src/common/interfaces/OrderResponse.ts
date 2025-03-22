import { Order } from "./Order";

export interface OrdersResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  orders: Order[];
}
