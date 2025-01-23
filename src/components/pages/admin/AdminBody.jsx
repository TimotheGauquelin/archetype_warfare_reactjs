import React from "react";

const AdminBody = ({ children, displayedNavbar }) => {
  return (
    <main
      className={`${
        displayedNavbar
          ? "sscreen:col-span-9 lscreen:col-span-10"
          : "col-span-12"
      } p-6 tablet:p-10 space-y-6 overflow-auto`}
      style={{ height: "calc(100vh - 80px)" }}
    >
      {children}
    </main>
  );
};

export default AdminBody;
