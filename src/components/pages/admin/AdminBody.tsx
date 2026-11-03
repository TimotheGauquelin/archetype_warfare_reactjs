import React from "react";

interface AdminBodyProps {
  children: React.ReactNode;
  displayedNavbar: boolean;
  contentHeight?: number;
}

const AdminBody: React.FC<AdminBodyProps> = ({
  children,
  displayedNavbar,
  contentHeight = 0,
}) => {
  return (
    <main
      className={`${
        displayedNavbar
          ? "col-span-12 sscreen:col-span-9 lscreen:col-span-10"
          : "col-span-12"
      } admin-body text-sm leading-snug p-3 tablet:p-4 sscreen:p-5 overflow-auto space-y-3 w-full min-h-0`}
      style={{
        height:
          contentHeight > 0 ? `${contentHeight}px` : "calc(100dvh - 5rem)",
      }}
    >
      {children}
    </main>
  );
};

export default AdminBody;
