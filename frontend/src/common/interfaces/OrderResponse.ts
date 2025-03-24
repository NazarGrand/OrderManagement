import { Order } from "./Order";

export interface OrdersResponse {
  total: number;
  totalPages: number;
  orders: Order[];
}
