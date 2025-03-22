import React, { useEffect } from "react";
import "./App.css";
import { getAllUsers } from "./services/UserService";
import { getUserOrders } from "./services/OrderService";

const fetch = async () => {
  try {
    const users = await getAllUsers();

    console.log(users);

    const orders = await getUserOrders(users.data[8].id);

    console.log(orders);
  } catch (e) {
    console.log(e);
  }
};

function App() {
  useEffect(() => {
    fetch();
  }, []);

  return (
    <div className="App">
      <h1>React</h1>
    </div>
  );
}

export default App;
