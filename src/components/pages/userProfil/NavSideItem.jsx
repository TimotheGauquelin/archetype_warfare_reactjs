import React from "react";
import { Link, useLocation } from "react-router-dom";

const NavSideItem = ({ url, label }) => {
  const location = useLocation();

  return (
    <Link
      className={`block p-2 ${
        location.pathname.includes(url) ? "border-l-4 border-indigo-500" : ""
      } hover:bg-blue-200`}
      to={url}
    >
      <li>{label}</li>
    </Link>
  );
};

export default NavSideItem;
