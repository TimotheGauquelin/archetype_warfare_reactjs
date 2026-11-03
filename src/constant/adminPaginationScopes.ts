export const ADMIN_LIST_PAGE_STORAGE_PREFIX = "admin-list-page:";
export const ADMIN_LIST_FILTERS_STORAGE_PREFIX = "admin-list-filters:";

export type AdminPaginationScope = {
  key: string;
  /** Paths that should keep the stored page for this list */
  match: (pathname: string) => boolean;
};

/**
 * Sections admin dont la pagination de liste doit survivre aux sous-pages
 * (add / update / détail) et se réinitialiser en quittant la section.
 */
export const ADMIN_PAGINATION_SCOPES: AdminPaginationScope[] = [
  {
    key: "admin-archetypes",
    match: (p) => p.startsWith("/admin/archetypes"),
  },
  {
    key: "admin-cards",
    match: (p) => p.startsWith("/admin/cards"),
  },
  {
    key: "admin-users",
    match: (p) => p.startsWith("/admin/users"),
  },
  {
    key: "admin-tournaments",
    match: (p) => p.startsWith("/admin/tournaments"),
  },
  {
    key: "admin-quiz-questions",
    match: (p) =>
      p.startsWith("/admin/quizzes/questions") ||
      p === "/admin/quizzes/add" ||
      p.startsWith("/admin/quizzes/update/"),
  },
  {
    key: "admin-quiz-seasons",
    match: (p) => p.startsWith("/admin/quizzes/seasons"),
  },
];

export const adminListPageStorageKey = (scopeKey: string) =>
  `${ADMIN_LIST_PAGE_STORAGE_PREFIX}${scopeKey}`;

export const adminListFiltersStorageKey = (scopeKey: string) =>
  `${ADMIN_LIST_FILTERS_STORAGE_PREFIX}${scopeKey}`;

export const clearInactiveAdminListPages = (pathname: string) => {
  for (const scope of ADMIN_PAGINATION_SCOPES) {
    if (!scope.match(pathname)) {
      sessionStorage.removeItem(adminListPageStorageKey(scope.key));
      sessionStorage.removeItem(adminListFiltersStorageKey(scope.key));
    }
  }
};
