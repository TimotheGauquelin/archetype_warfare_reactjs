import React, { useState } from "react";
import AdminBody from "./AdminBody";
import AdminHeader from "./AdminHeader";
import AdminSideBar from "./AdminSidebar";

interface AdminStructureProps {
  children: React.ReactNode;
}

const AdminStructure: React.FC<AdminStructureProps> = ({ children }) => {
  const [displayedNavbar, setDisplayedNavbar] = useState(true);

  return (
    <>
      <AdminHeader
        // adminName={decoded?.sub}
        displayedNavbar={displayedNavbar}
        setDisplayedNavbar={setDisplayedNavbar}
      />
      <div className="sscreen:grid sscreen:grid-cols-12 sscreen:flex">
        <AdminSideBar displayedNavbar={displayedNavbar} />
        <AdminBody displayedNavbar={displayedNavbar}>{children}</AdminBody>
      </div>{" "}
    </>
  );
};

export default AdminStructure;
