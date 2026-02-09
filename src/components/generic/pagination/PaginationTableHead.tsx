import React from "react";
import PaginationTableHeadItem from "./PaginationTableHeadItem";

interface TableHeadItem {
  colspan: string;
  label: string;
}

interface PaginationTableHeadProps {
  tableHeadItem: TableHeadItem[];
}

const PaginationTableHead: React.FC<PaginationTableHeadProps> = ({ tableHeadItem }) => {
  return (
    <div className="grid grid-cols-12 text-xs text-gray-700 uppercase bg-gray-100 rounded-t-md">
      {tableHeadItem?.map((headItem, index) => {
        return (
          <PaginationTableHeadItem
            key={index}
            colspan={headItem.colspan}
            label={headItem.label}
          />
        );
      })}
    </div>
  );
};

export default PaginationTableHead;
