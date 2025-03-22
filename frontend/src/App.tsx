import React, { ChangeEvent, useEffect, useState } from "react";
import "./App.scss";
import { getAllUsers } from "./services/UserService";
import { getUserOrders } from "./services/OrderService";
import OrdersTable from "./components/OrdersTable/OrdersTable";
import { User } from "./common/interfaces/User";
import { Product } from "./common/interfaces/Product";
import { getAllProducts } from "./services/ProductService";
import { AxiosResponse } from "axios";
import { Order } from "./common/interfaces/Order";
import { OrdersResponse } from "./common/interfaces/OrderResponse";

function App() {
  const [users, setUsers] = useState<User[]>();
  const [currentUser, setCurrentUser] = useState<User>();

  const [products, setProducts] = useState<Product[]>();
  const [orders, setOrders] = useState<Order[]>();

  const loadInitialData = async () => {
    try {
      const { data: users } = (await getAllUsers()) as AxiosResponse<User[]>;
      setUsers(users);
      setCurrentUser(users[0]);

      const { data: products } = (await getAllProducts()) as AxiosResponse<
        Product[]
      >;
      setProducts(products);
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  };

  const fetchUserOrders = async (userId: string) => {
    try {
      const { data: userOrders } = (await getUserOrders(
        userId
      )) as AxiosResponse<OrdersResponse>;
      setOrders(userOrders.orders);
    } catch (error) {
      console.error("Error getting user orders:", error);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchUserOrders(currentUser.id);
    }
  }, [currentUser]);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedUserId = event.target.value;
    const selectedUser = users?.find((user) => user.id === selectedUserId);
    setCurrentUser(selectedUser);
  };

  return (
    <div className="App">
      <select value={currentUser?.id} onChange={handleChange}>
        {users?.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
      {orders && orders.length > 0 ? (
        <OrdersTable orders={orders} />
      ) : (
        <p>The order list for this user is empty.</p>
      )}
    </div>
  );
}

export default App;
