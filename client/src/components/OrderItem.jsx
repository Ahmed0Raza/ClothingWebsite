import React from 'react';

const OrderItem = ({ products, amount, status }) => {
  return (
    <div className="w-full border-b border-gray-200 bg-white">
      <div className="py-6">
        {/* Header Section */}
        <div className="flex justify-between items-start">
          {/* Left Side */}
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-gray-900 m-0">
              Ordered {products.length} {products.length > 1 ? 'items' : 'item'}
            </h3>
            <button className="px-3 py-1 text-sm bg-black text-white hover:bg-gray-800 transition-colors">
              View More Details
            </button>
          </div>

          {/* Right Side - Amount & Status */}
          <div className="text-right">
            <p className="text-base font-medium text-gray-900 mb-1">
              PKR {amount.toFixed(2)}
            </p>
            <p className={`text-sm font-medium ${
              status === 'Completed' 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {status}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;