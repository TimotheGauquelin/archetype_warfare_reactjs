import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api_aw from "../../../api/api_aw";
import AdminBodyHeader from "../../../components/pages/admin/AdminBodyHeader";
import AdminStructure from "../../../components/pages/admin/AdminStructure";

const AdminFiles = () => {
  const [jumbotronArchetype, setJumbotronArchetype] = useState([]);
  const [headerArchetype, setHeaderArchetype] = useState([]);

  const getAllJumbotronArchetype = () => {
    api_aw.get(`public/profiles`).then((response) => {
      if (response.status === 200) {
        setJumbotronArchetype(
          response.data.filter(
            (jumbotron) => jumbotron.filetype === "ARCHETYPE_JUMBOTRON"
          )
        );
        setHeaderArchetype(
          response.data.filter(
            (jumbotron) => jumbotron.filetype === "ARCHETYPE_PRESENTATION"
          )
        );
      }
    });
  };

  useEffect(() => {
    getAllJumbotronArchetype();
  }, []);

  return (
    <AdminStructure>
      <AdminBodyHeader
        label="Fichiers"
        catchphrase="Vérifiez tous les fichiers"
      />
      <div>
        <p className="text-xl font-bold">
          Voir tous les en-têtes d'archetype :
        </p>
        <div className="bg-gray-200 rounded p-1 my-2 ">
          <div className="grid grid-cols-12 gap-1">
            {headerArchetype.slice(0, 4).map((header) => {
              return (
                <div className="col-span-3 border-2 border-black rounded">
                  <img src={header.url} alt="" />
                </div>
              );
            })}
          </div>
          <Link
            className="block lscreen:pr-5"
            to="/admin/files/archetypesheader"
            state={{ filesArray: headerArchetype }}
          >
            <button className="bg-green-300 mt-2 rounded p-1">Voir tout</button>
          </Link>
        </div>
      </div>
      <div>
        <p className="text-xl font-bold">
          Voir tous les jumbotrons d'archetype :
        </p>
        <div className="bg-gray-200 rounded p-1 my-2 ">
          <div className="grid grid-cols-12 gap-1">
            {jumbotronArchetype.slice(0, 2).map((jumbotron) => {
              return (
                <div className="col-span-6 border-2 border-black rounded">
                  <img src={jumbotron.url} alt="" />
                </div>
              );
            })}
          </div>
          <Link
            className="block lscreen:pr-5"
            to="/admin/files/archetypesjumbotron"
            state={{ filesArray: jumbotronArchetype }}
          >
            <button className="bg-green-300 mt-2 rounded p-1">Voir tout</button>
          </Link>
        </div>
      </div>
    </AdminStructure>
  );
};

export default AdminFiles;
