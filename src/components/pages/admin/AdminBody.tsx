import React from "react";

interface AdminBodyProps {
  children: React.ReactNode;
  displayedNavbar: boolean;
}

const AdminBody: React.FC<AdminBodyProps> = ({ children, displayedNavbar }) => {
  return (
    <main
      className={`${
        displayedNavbar
          ? "col-span-12 sscreen:col-span-9 lscreen:col-span-10"
          : "col-span-12"
      } p-4 tablet:p-6 sscreen:p-10 overflow-auto space-y-4 w-full`}
      style={{ height: "calc(100vh - 80px)" }}
    >
      {children}
    </main>
  );
};

export default AdminBody;
