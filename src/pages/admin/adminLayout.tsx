import React, { useState } from "react";
import AdminBody from "../../components/pages/admin/AdminBody";
import AdminHeader from "../../components/pages/admin/AdminHeader";
import AdminSideBar from "../../components/pages/admin/AdminSidebar";

interface AdminStructureProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminStructureProps> = ({ children }) => {
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

export default AdminLayout;
