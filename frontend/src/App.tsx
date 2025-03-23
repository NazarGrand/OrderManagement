import React, { ChangeEvent, useEffect, useState } from "react";
import "./App.scss";
import { getAllUsers } from "./services/UserService";
import { getUserOrders } from "./services/OrderService";
import OrdersTable from "./components/OrdersTable/OrdersTable";
import { User } from "./common/interfaces/User";
import { Product } from "./common/interfaces/Product";
import { getAllProducts } from "./services/ProductService";
import { Order } from "./common/interfaces/Order";
import OrderCreationModal from "./components/OrderCreationModal/OrderCreationModal";

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [isOpenOrderCreation, setIsOpenOrderCreation] =
    useState<boolean>(false);

  const loadInitialData = async () => {
    try {
      const users = await getAllUsers();
      setUsers(users);
      setSelectedUser(users[0]);

      const products = await getAllProducts();
      setProducts(products);
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  };

  const fetchUserOrders = async (userId: string) => {
    try {
      const userOrders = await getUserOrders(userId);
      setOrders(userOrders.orders);
    } catch (error) {
      console.error("Error getting user orders:", error);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchUserOrders(selectedUser.id);
    }
  }, [selectedUser]);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedUserId = event.target.value;
    const selectedUser = users?.find((user) => user.id === selectedUserId);
    if (selectedUser) {
      setSelectedUser(selectedUser);
    }
  };

  return (
    <div className="App">
      <select value={selectedUser?.id} onChange={handleChange}>
        {users?.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
      {orders && orders.length > 0 ? (
        <OrdersTable orders={orders} />
      ) : (
        <p className="emptyListMessage">
          The order list for this user is empty.
        </p>
      )}

      <button className="addOrder" onClick={() => setIsOpenOrderCreation(true)}>
        New Order
      </button>

      {isOpenOrderCreation && (
        <OrderCreationModal
          onClose={() => setIsOpenOrderCreation(false)}
          users={users}
          products={products}
          selectedUser={selectedUser!}
          setSelectedUser={setSelectedUser}
          fetchUserOrders={fetchUserOrders}
        />
      )}
    </div>
  );
}

export default App;
