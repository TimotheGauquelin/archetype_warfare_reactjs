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
          ? "sscreen:col-span-9 lscreen:col-span-10"
          : "col-span-12"
      } p-6 tablet:p-10 overflow-auto`}
      style={{ height: "calc(100vh - 80px)" }}
    >
      {children}
    </main>
  );
};

export default AdminBody;
