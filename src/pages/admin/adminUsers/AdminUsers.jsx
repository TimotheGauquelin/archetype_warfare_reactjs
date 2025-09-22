import React, { useEffect, useState } from "react";
import AdminBodyHeader from "../../../components/pages/admin/AdminBodyHeader";
import AdminStructure from "../../../components/pages/admin/AdminStructure";
import AdminUserPagination from "../../../components/pages/admin/users/AdminUserPagination";
import { searchUsers } from "../../../services/user";
import { URL_FRONT_ADMIN_USER_ADD } from "../../../constant/urlsFront";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [pagination, setPagination] = useState(1);
  const [pageSize] = useState(10);
  const criteria = {
    username: "",
  };

  useEffect(() => {
    searchUsers(pageSize, pagination, criteria, setUsers);
    setRefresh(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, criteria]);

  return (
    <AdminStructure>
      <AdminBodyHeader
        label="Utilisateurs"
        catchphrase="Interagissez avec vos invités"
        buttonUrl={URL_FRONT_ADMIN_USER_ADD}
        buttonLabel="Ajouter une utilisateur"
      />
      <AdminUserPagination
        setRefresh={setRefresh}
        currentPage={users?.pagination?.currentPage}
        users={users}
        setPagination={setPagination}
        usersTotalCount={users?.pagination?.totalItems}
        totalPages={users?.pagination?.totalPages}
        pageSize={users.pagination?.pageSize}
      />
    </AdminStructure>
  );
};

export default AdminUsers;
