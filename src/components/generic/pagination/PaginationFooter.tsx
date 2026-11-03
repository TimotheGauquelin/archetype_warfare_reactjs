import React, { useEffect, useState } from "react";

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
  pageSize,
}) => {
  const [pageInput, setPageInput] = useState(String(currentPage));

  useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  const goToPage = (page: number) => {
    const max = Math.max(1, totalPages || 1);
    const next = Math.min(Math.max(1, page), max);
    if (next === currentPage) {
      setPageInput(String(currentPage));
      return;
    }
    setPagination(next);
    setRefresh();
  };

  const commitPageInput = () => {
    const parsed = Number.parseInt(pageInput, 10);
    if (!Number.isFinite(parsed)) {
      setPageInput(String(currentPage));
      return;
    }
    goToPage(parsed);
  };

  const prevButton =
    currentPage > 1 ? (
      <button
        type="button"
        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        onClick={() => goToPage(currentPage - 1)}
        aria-label="Page précédente"
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
    ) : null;

  const nextButton =
    currentPage < totalPages ? (
      <button
        type="button"
        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer"
        onClick={() => goToPage(currentPage + 1)}
        aria-label="Page suivante"
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
    ) : null;

  const pageNav = (
    <nav
      className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px items-center"
      aria-label="Pagination"
    >
      {prevButton}
      <span className="relative inline-flex items-center gap-1 px-2 tablet:px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
        <label className="sr-only" htmlFor="pagination-page-input">
          Numéro de page
        </label>
        <input
          id="pagination-page-input"
          type="number"
          min={1}
          max={Math.max(1, totalPages || 1)}
          inputMode="numeric"
          value={pageInput}
          onChange={(e) => setPageInput(e.target.value)}
          onBlur={commitPageInput}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              (e.target as HTMLInputElement).blur();
            }
          }}
          className="w-12 tablet:w-14 text-center border border-gray-300 rounded px-1 py-0.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-400"
          aria-label="Aller à la page"
        />
        {totalPages > 0 ? (
          <span className="text-gray-500 whitespace-nowrap">/ {totalPages}</span>
        ) : null}
      </span>
      {nextButton}
    </nav>
  );

  return (
    <div className="bg-white flex items-center justify-between mt-4 gap-2">
      <div className="flex flex-1 items-center justify-between gap-2 tablet:hidden">
        <p className="text-xs text-gray-700 font-bold leading-snug">
          {itemsTotalCount > 0
            ? `${itemsTotalCount} résultat${itemsTotalCount > 1 ? "s" : ""}`
            : "Aucun résultat"}
        </p>
        {pageNav}
      </div>
      <div className="hidden tablet:flex-1 tablet:flex tablet:items-center tablet:justify-between">
        <div>
          <p className="text-sm text-gray-700 font-bold">
            {itemsTotalCount > 0
              ? `Affichage du ${((currentPage - 1) * pageSize) + 1}${
                  currentPage === 1 ? "er" : "ème"
                } au ${
                  currentPage === totalPages
                    ? itemsTotalCount
                    : currentPage * pageSize
                }ème sur ${itemsTotalCount} résultats`
              : "Aucun résultat trouvé"}
          </p>
        </div>
        <div>{pageNav}</div>
      </div>
    </div>
  );
};

export default Pagination;
