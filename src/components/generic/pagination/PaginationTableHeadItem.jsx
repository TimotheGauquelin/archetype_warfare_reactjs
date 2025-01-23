import React from "react";

const PaginationTableHeadItem = ({ colspan, label }) => {
  return (
    <div className={`${colspan} flex items-center px-3 py-4`}>{label}</div>
  );
};

export default PaginationTableHeadItem;
