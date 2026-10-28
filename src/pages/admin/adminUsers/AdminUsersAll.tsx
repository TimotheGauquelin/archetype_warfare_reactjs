import { useCallback, useEffect, useState } from "react";
import AdminBodyHeader from "../../../components/pages/admin/AdminBodyHeader";
import AdminStructure from "../adminLayout";
import AdminUserPagination from "../../../components/pages/admin/users/AdminUserPagination";
import AdminUserFilter, {
  type AdminUserFilters,
} from "../../../components/pages/admin/users/AdminUserFilter";
import { getUserRoles, searchUsers, type UserRoleOption } from "../../../services/user";
import { URL_FRONT_ADMIN_USER_ADD } from "../../../constant/urlsFront";
import type { UserSearchResponse, Pagination } from "../../../types";

const defaultFilters = (): AdminUserFilters => ({
  q: "",
  is_active: "",
  is_banned: "",
  role: "",
});

const AdminUsersAll = () => {
  const [users, setUsers] = useState<UserSearchResponse | null>(null);
  const [roles, setRoles] = useState<UserRoleOption[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [filters, setFilters] = useState<AdminUserFilters>(defaultFilters());
  const [debouncedQ, setDebouncedQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(filters.q.trim()), 300);
    return () => clearTimeout(t);
  }, [filters.q]);

  useEffect(() => {
    void getUserRoles().then(setRoles);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedQ, filters.is_active, filters.is_banned, filters.role]);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const pagination: Pagination = {
        total: 0,
        totalPages: 1,
        currentPage,
        pageSize,
      };
      await searchUsers(
        pageSize,
        pagination,
        {
          q: debouncedQ,
          is_active: filters.is_active,
          is_banned: filters.is_banned,
          role: filters.role,
        },
        (v) =>
          setUsers((prev) =>
            typeof v === "function"
              ? (v as (p: UserSearchResponse | null) => UserSearchResponse | null)(
                  prev
                )
              : v
          )
      );
    } catch (e) {
      setError("Erreur lors du chargement des utilisateurs.");
      console.error(e);
    } finally {
      setLoading(false);
      if (refresh) setRefresh(false);
    }
  }, [
    pageSize,
    currentPage,
    debouncedQ,
    filters.is_active,
    filters.is_banned,
    filters.role,
    refresh,
  ]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const resetAllFilters = () => {
    setFilters(defaultFilters());
    setDebouncedQ("");
    setCurrentPage(1);
  };

  return (
    <AdminStructure>
      <AdminBodyHeader
        label="Tous les utilisateurs"
        catchphrase="Recherche et gestion de l'ensemble des comptes"
        buttonUrl={URL_FRONT_ADMIN_USER_ADD}
        buttonLabel="Ajouter un utilisateur"
        returnButton
      />

      {error && (
        <div className="bg-red-100 text-red-600 border border-red-200 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <section className="bg-white border border-gray-200 rounded-lg p-2.5 tablet:p-4 shadow-sm space-y-3 tablet:space-y-4 overflow-hidden">
        <AdminUserFilter
          roles={roles}
          criteria={filters}
          setCriteria={setFilters}
          resetAllFilters={resetAllFilters}
        />

        <AdminUserPagination
          setRefresh={setRefresh}
          currentPage={users?.pagination?.currentPage ?? currentPage}
          users={
            users ?? {
              data: [],
              pagination: {
                total: 0,
                totalPages: 1,
                currentPage: 1,
                pageSize,
              },
            }
          }
          setPagination={setCurrentPage}
          usersTotalCount={users?.pagination?.total ?? 0}
          totalPages={users?.pagination?.totalPages ?? 1}
          pageSize={users?.pagination?.pageSize ?? pageSize}
          loading={loading}
        />
      </section>
    </AdminStructure>
  );
};

export default AdminUsersAll;
