import React, { useState, useEffect } from "react";
import AdminBodyHeader from "../../components/pages/admin/AdminBodyHeader";

import AdminStructure from "../../components/pages/admin/AdminStructure";
import api_aw from "../../api/api_aw";
import { URL_BACK_GET_NEW_USERS } from "../../constant/urlsBack";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const AdminHome = () => {
  const [newUsers, setNewUsers] = useState([]);
  const { username } = useSelector((state) => state.user);

  useEffect(() => {
    api_aw.get(URL_BACK_GET_NEW_USERS)
      .then((response) => {
        setNewUsers(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <AdminStructure>
      <AdminBodyHeader
        label="Tableau de Bord"
        catchphrase={`Bonjour ${username}, comment allez-vous aujourd'hui ?`}
      />
      <h2 className="text-2xl font-semibold mb-2">Alertes:</h2>
      {newUsers.length > 0 &&
        <div className="flex flex-col bg-red-100 p-2 rounded-lg">
          <p className="font-semibold mb-2">
            <span>Nouveaux utilisateurs à valider</span>
            <span className=" text-red-500"> (3)</span>
          </p>
          <div className="rounded-lg">
            <ul>
              {newUsers
                .slice(0, 3)
                .map((user) => (
                  <li key={user.id} className="cursor-pointer bg-white rounded-sm">
                    <Link className="block p-2 rounded-sm" to={`/admin/users/update/${user.id}`}>
                      {user.username}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      }
    </AdminStructure>
  );
};

export default AdminHome;
