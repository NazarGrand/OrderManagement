import { Product } from "./Product";
import { User } from "./User";

export interface Order {
  id: string;
  user: User;
  product: Product;
  quantity: number;
  totalPrice: number;
  createdAt: string;
}
