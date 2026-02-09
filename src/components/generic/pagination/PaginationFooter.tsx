import React from "react";

interface PaginationFooterProps {
  currentPage: number;
  setPagination: (page: number) => void;
  setRefresh: () => void;
  itemsTotalCount: number;
  totalPages: number;
  pageSize: number;
}

const Pagination: React.FC<PaginationFooterProps> = ({
  currentPage,
  setPagination,
  setRefresh,
  itemsTotalCount,
  totalPages,
  pageSize
}) => {

  return (
    <div className="bg-white flex items-center justify-between mt-4">
      <div className="hidden tablet:flex-1 tablet:flex tablet:items-center tablet:justify-between">
        <div>
          <p className="text-sm text-gray-700 font-bold">
            {itemsTotalCount > 0
              ? `Affichage du ${((currentPage - 1) * pageSize) + 1 }${
                  currentPage === 1 ? "er" : "ème"
                } au ${
                  currentPage === totalPages
                    ? itemsTotalCount
                    : (currentPage) * pageSize
                }ème sur ${itemsTotalCount} résultats`
              : "Aucun résultat trouvé"}
          </p>
        </div>
        <div>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            {currentPage > 1 && (
              <button
                type="button"
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                onClick={() => {
                  setPagination(currentPage - 1);
                  setRefresh();
                }}
              >
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
              {currentPage}
            </span>
            {currentPage < totalPages && (
              <button
                type="button"
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  setPagination(currentPage + 1);
                  setRefresh();
                }}
              >
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
