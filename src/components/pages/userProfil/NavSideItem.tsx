import React from "react";
import { Link, useLocation } from "react-router-dom";

interface NavSideItemProps {
  url: string;
  label: string;
}

const NavSideItem: React.FC<NavSideItemProps> = ({ url, label }) => {
  const location = useLocation();

  return (
    <Link
      className={`block p-2 ${
        location.pathname.includes(url) ? "border-l-4 border-indigo-500" : "border-l-4 border-transparent"
      } hover:bg-blue-200`}
      to={url}
    >
      <li>{label}</li>
    </Link>
  );
};

export default NavSideItem;
