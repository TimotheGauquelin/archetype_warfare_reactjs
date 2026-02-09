import { useCallback, useEffect, useMemo, useState } from "react";
import AdminBodyHeader from "../../../components/pages/admin/AdminBodyHeader";
import AdminStructure from "../../../components/pages/admin/AdminStructure";
import AdminUserPagination from "../../../components/pages/admin/users/AdminUserPagination";
import { searchUsers } from "../../../services/user";
import { URL_FRONT_ADMIN_USER_ADD } from "../../../constant/urlsFront";
import type { UserSearchResponse, Pagination } from "../../../types";

const AdminUsers = () => {
  const [users, setUsers] = useState<UserSearchResponse | null>(null);
  const [refresh, setRefresh] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const [username, setUsername] = useState("");
  const [debouncedUsername, setDebouncedUsername] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedUsername(username.trim()), 300);
    return () => clearTimeout(t);
  }, [username]);

  const criteria = useMemo(() => ({ username: debouncedUsername }), [debouncedUsername]);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const pagination: Pagination = {
        total: 0,
        totalPages: 1,
        currentPage,
        pageSize
      };
      await searchUsers(pageSize, pagination, criteria, (v) => setUsers(prev => typeof v === 'function' ? (v as (p: UserSearchResponse | null) => UserSearchResponse | null)(prev) : v));
    } catch (e) {
      setError("Erreur lors du chargement des utilisateurs.");
      console.error(e);
    } finally {
      setLoading(false);
      if (refresh) {
        setRefresh(false);
      }
    }
  }, [pageSize, currentPage, criteria, refresh]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <AdminStructure>
      <AdminBodyHeader
        label="Utilisateurs"
        catchphrase="Interagissez avec vos invités"
        buttonUrl={URL_FRONT_ADMIN_USER_ADD}
        buttonLabel="Ajouter une utilisateur"
      />

      <div className="flex flex-col bg-slate-200 rounded p-2">
        <h2 className="mb-2">Filtres : </h2>
        <input
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            if (currentPage !== 1) setCurrentPage(1);
          }}
          placeholder="Rechercher par pseudo..."
          className="border rounded-md p-2 text-sm w-full max-w-xs bg-white"
          aria-label="Rechercher un utilisateur par pseudo"
        />
      </div>

      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded-md mb-3">
          {error}
        </div>
      )}

      <AdminUserPagination
        setRefresh={setRefresh}
        currentPage={users?.pagination?.currentPage ?? currentPage}
        users={users ?? { data: [], pagination: { total: 0, totalPages: 1, currentPage: 1, pageSize } }}
        setPagination={setCurrentPage}
        usersTotalCount={users?.pagination?.total ?? 0}
        totalPages={users?.pagination?.totalPages ?? 1}
        pageSize={users?.pagination?.pageSize ?? pageSize}
        loading={loading}
      />
    </AdminStructure>
  );
};

export default AdminUsers;