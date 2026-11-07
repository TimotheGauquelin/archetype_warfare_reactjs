import React from "react";

interface PaginationTableHeadItemProps {
  colspan: string;
  label?: string;
  children?: React.ReactNode;
}

const PaginationTableHeadItem: React.FC<PaginationTableHeadItemProps> = ({
  colspan,
  label,
  children,
}) => {
  return (
    <div className={`${colspan} flex justify-center items-center px-3 py-4 border border-1 gap-1.5`}>
      {children ?? label}
    </div>
  );
};

export default PaginationTableHeadItem;
