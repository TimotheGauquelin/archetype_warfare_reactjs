import React, { useEffect, useState } from "react";
import api_aw from "../../../api/api_aw";
import AdminBodyHeader from "../../../components/pages/admin/AdminBodyHeader";
import AdminStructure from "../../../components/pages/admin/AdminStructure";
import AdminUserPagination from "../../../components/pages/admin/users/AdminUserPagination";
import { URL_BACK_GET_ALL_USERS } from "../../../constant/urlsBack";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const getUsers = () => {
    api_aw.get(URL_BACK_GET_ALL_USERS).then((response) => {
      if (response.status === 200) {
        setUsers(response.data);
      }
    });
  };

  useEffect(() => {
    getUsers();
    setRefresh(false);
  }, [refresh]);

  console.log(users);

  return (
    <AdminStructure>
      <AdminBodyHeader
        label="Utilisateurs"
        catchphrase="Interagissez avec vos invités"
        buttonUrl="/admin/users/form"
        buttonLabel="Ajouter une utilisateur"
      />
      <AdminUserPagination users={users} setRefresh={setRefresh} />
    </AdminStructure>
  );
};

export default AdminUsers;
