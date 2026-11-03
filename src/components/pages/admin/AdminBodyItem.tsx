import React from "react";

interface AdminBodyItemProps {
  quantity: number;
  label: string;
  children: React.ReactNode;
}

const AdminBodyItem: React.FC<AdminBodyItemProps> = ({ quantity, label, children }) => {
  return (
    <div className="flex items-center p-4 bg-white shadow rounded-lg">
      <div className="inline-flex flex-shrink-0 items-center justify-center h-10 w-10 text-blue-600 bg-blue-100 rounded-full mr-3">
        {children}
      </div>
      <div>
        <span className="block text-lg font-bold leading-tight">{quantity}</span>
        <span className="block text-gray-500 text-xs">{label}</span>
      </div>
    </div>
  );
};

export default AdminBodyItem;
