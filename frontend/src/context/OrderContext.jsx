import React, { createContext, useState, useContext } from 'react';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  const addOrder = (newOrder) => {
    setOrders((prevOrders) => {
      // Check for duplicates
      const exists = prevOrders.find(order => order.id === newOrder.id);
      if (!exists) {
        return [...prevOrders, newOrder];
      }
      return prevOrders;
    });
  };

  // New remove function
  const removeOrder = (id) => {
    setOrders((prevOrders) => prevOrders.filter(order => order.id !== id));
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, removeOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    // Optionally log a warning here
    return { orders: [], addOrder: () => {}, removeOrder: () => {} };
  }
  return context;
};
