import React from "react";

const Pagination = ({
  pagination,
  setPagination,
  itemArraySize,
  setRefresh,
  displayingNumberSize,
}) => {
  const nbMaxPage = Math.ceil(itemArraySize / displayingNumberSize);

  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t rounded-b-lg border-gray-200 tablet:px-6">
      <div className="hidden tablet:flex-1 tablet:flex tablet:items-center tablet:justify-between">
        <div>
          <p className="text-sm text-gray-700 font-bold">
            {itemArraySize > 0
              ? `Affichage du ${pagination === 0 ? "" : pagination}1${
                  pagination === 0 ? "er" : "ème"
                } au ${
                  pagination === nbMaxPage - 1
                    ? itemArraySize
                    : (pagination + 1) * displayingNumberSize
                }ème sur ${itemArraySize} résultats`
              : "Aucun résultat trouvé"}
          </p>
        </div>
        <div>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            {pagination > 0 && (
              <div
                href="#"
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                onClick={() => {
                  setPagination(pagination > 0 && pagination - 1);
                  setRefresh();
                }}
                s
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
              </div>
            )}
            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
              {pagination + 1}
            </span>
            {pagination < nbMaxPage - 1 && (
              <div
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  setPagination(pagination < nbMaxPage - 1 && pagination + 1);
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
              </div>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
