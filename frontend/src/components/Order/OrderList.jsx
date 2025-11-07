import React, { useEffect } from 'react';
import { useOrder } from '../../context/OrderContext';
import { useLocation } from 'react-router-dom';


const OrderList = () => {
    const { orders, removeOrder } = useOrder();
    const location = useLocation();
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
      <div className="order-list bg-gray-50 p-6 rounded-lg shadow-lg max-w-md mx-auto mt-8">
        <h2 className="text-xl mb-4 text-center text-gray-700">Your Orders</h2>
        {orders.length > 0 ? (
          <ul className="space-y-4">
            {orders.map(order => (
              <li key={order.id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                <div className="flex items-center space-x-3">
                  <img src={order.image} alt={order.name} className="w-12 h-12 object-cover rounded-md" />
                  <div>
                    <p className="font-semibold text-gray-800">{order.name}</p>
                    <p className="text-sm text-gray-500">${order.price}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-yellow-500 font-semibold">Qty: 1</span>
                  <button
                    onClick={() => removeOrder(order.id)}
                    className="text-red-500 hover:text-red-700 transition-colors text-sm"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">No items in your order list.</p>
        )}
      </div>
    );
  };
  
  export default OrderList;