import { FunctionComponent } from "react";
import { Order } from "../../common/interfaces/Order";
import "./OrdersTable.scss";

interface OrderTableProps {
  orders: Order[] | undefined;
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
            <td>{order.createdAt}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrdersTable;
