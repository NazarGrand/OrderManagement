import { FunctionComponent } from "react";
import { Order } from "../../common/interfaces/Order";
import "./OrdersTable.scss";
import dayjs from "dayjs";

interface OrderTableProps {
  orders: Order[];
}

const OrdersTable: FunctionComponent<OrderTableProps> = ({ orders }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Product Name</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Total Price</th>
          <th>Order Date</th>
        </tr>
      </thead>
      <tbody>
        {orders?.map((order) => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>{order.product.name}</td>
            <td>{order.product.price}</td>
            <td>{order.quantity}</td>
            <td>{order.totalPrice}</td>
            <td>{dayjs(order.createdAt).format("DD.MM.YYYY HH:mm:ss")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrdersTable;
