import React, { useState } from "react";
import AdminBody from "./AdminBody";
import AdminHeader from "./AdminHeader";
import AdminSideBar from "./AdminSidebar";
import jwt_decode from "jwt-decode";
import { useSelector } from "react-redux";

const AdminStructure = ({ children }) => {
  const [displayedNavbar, setDisplayedNavbar] = useState(true);
  const { token } = useSelector((state) => state.user);
  var decoded = token && jwt_decode(token);

  return (
    <>
      <AdminHeader
        adminName={decoded?.sub}
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
