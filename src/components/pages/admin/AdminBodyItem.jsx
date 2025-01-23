import React from "react";

const AdminBodyItem = ({ quantity, label, children }) => {
  return (
    <div className="flex items-center p-8 bg-white shadow rounded-lg">
      <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full mr-6">
        {children}
      </div>
      <div>
        <span className="block text-2xl font-bold">{quantity}</span>
        <span className="block text-gray-500">{label}</span>
      </div>
    </div>
  );
};

export default AdminBodyItem;
