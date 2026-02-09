import React from "react";

interface PaginationTableHeadItemProps {
  colspan: string;
  label: string;
}

const PaginationTableHeadItem: React.FC<PaginationTableHeadItemProps> = ({ colspan, label }) => {
  return (
    <div className={`${colspan} flex justify-center items-center px-3 py-4 border border-1`}>{label}</div>
  );
};

export default PaginationTableHeadItem;
