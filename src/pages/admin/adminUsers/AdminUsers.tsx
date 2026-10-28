import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminBodyHeader from "../../../components/pages/admin/AdminBodyHeader";
import AdminStructure from "../adminLayout";
import AdminUserPagination from "../../../components/pages/admin/users/AdminUserPagination";
import { searchUsers } from "../../../services/user";
import {
  URL_FRONT_ADMIN_USER_ADD,
  URL_FRONT_ADMIN_USERS_ALL,
} from "../../../constant/urlsFront";
import type { UserSearchResponse } from "../../../types";

const PREVIEW_LIMIT = 10;

const AdminUsers = () => {
  const [users, setUsers] = useState<UserSearchResponse | null>(null);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await searchUsers(
        PREVIEW_LIMIT,
        { total: 0, totalPages: 1, currentPage: 1, pageSize: PREVIEW_LIMIT },
        { username: "" },
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
  }, [refresh]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  return (
    <AdminStructure>
      <AdminBodyHeader
        label="Utilisateurs"
        catchphrase="Derniers inscrits et gestion des comptes"

      />

      {error && (
        <div className="bg-red-100 text-red-600 border border-red-200 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <section className="bg-white border border-gray-200 rounded-lg p-2.5 tablet:p-4 shadow-sm space-y-3 overflow-hidden">
        <div className="flex flex-col sscreen:flex-row sscreen:items-center sscreen:justify-between gap-2 tablet:gap-3">
          <h2 className="text-lg tablet:text-xl font-semibold text-gray-900 leading-snug">
            Gérer les utilisateurs
          </h2>
          <div className="flex flex-col tablet:flex-row flex-wrap gap-2 w-full sscreen:w-auto">
            <Link
              to={URL_FRONT_ADMIN_USER_ADD}
              className="h-fit block text-center text-white px-3 py-2 bg-blue-400 rounded hover:bg-blue-500 font-bold text-sm"
            >
              Ajouter un utilisateur
            </Link>
            <Link
              to={URL_FRONT_ADMIN_USERS_ALL}
              className="h-fit block text-center text-blue-700 px-3 py-2 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 font-semibold text-sm"
            >
              Voir tous les utilisateurs
            </Link>
          </div>
        </div>

        <AdminUserPagination
          setRefresh={setRefresh}
          currentPage={1}
          users={
            users ?? {
              data: [],
              pagination: {
                total: 0,
                totalPages: 1,
                currentPage: 1,
                pageSize: PREVIEW_LIMIT,
              },
            }
          }
          setPagination={() => undefined}
          usersTotalCount={users?.data?.length ?? 0}
          totalPages={1}
          pageSize={PREVIEW_LIMIT}
          loading={loading}
          showFooter={false}
        />
      </section>
    </AdminStructure>
  );
};

export default AdminUsers;
