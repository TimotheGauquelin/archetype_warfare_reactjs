import React from "react";
import AdminArchetypePaginationTableBody from "./AdminArchetypePaginationTableBody";
import { toast } from "react-toastify";
import PaginationTableHead from "../../../generic/pagination/PaginationTableHead";
import PaginationFooter from "../../../generic/pagination/PaginationFooter";
import api_aw from "../../../../api/api_aw";

const AdminArchetypePagination = ({
  setRefresh,
  archetypes,
  pagination,
  setPagination,
  archetypesTotalCount,
  displayingNumberSize,
}) => {
  //Items des differentes lignes du tableau

  const tableHeadItemArray = [
    {
      colspan: "col-span-2",
      label: "Nom de l'Archetype",
    },
    {
      colspan: "col-span-1",
      label: "Attributs",
    },
    {
      colspan: "col-span-1",
      label: "Types",
    },
    {
      colspan: "col-span-1",
      label: "Méthode d'invocation",
    },
    {
      colspan: "col-span-1",
      label: "Affiché Slider",
    },
    {
      colspan: "col-span-1",
      label: "En ligne",
    },
    {
      colspan: "col-span-1",
      label: "Nb. Cartes",
    },
    {
      colspan: "col-span-1",
      label: "Position",
    },
    {
      colspan: "col-span-1",
      label: "IDK",
    },
    {
      colspan: "col-span-1",
      label: "Actions",
    },
  ];

  //Rend vrai ou faux la mise en lumière d'un archétype

  const toggleHighlighted = (archetypeId) => {
    api_aw
      .put(`/public/archetypes/${archetypeId}/switchHighlighted`)
      .then((response) => {
        if (response.status === 202) {
          setRefresh(true);
        }
      })
      .catch((error) => console.log(error));
  };

  //Rend vrai ou faux l'activation d'un archétype

  const toggleIsActive = (archetypeId) => {
    api_aw
      .put(`/public/archetypes/${archetypeId}/switchIsActive`)
      .then((response) => {
        if (response.status === 202) {
          setRefresh(true);
        }
      })
      .catch((error) => console.log(error));
  };

  //Supprime un archetype

  const deleteArchetype = (archetypeId, archetypeName) => {
    api_aw
      .delete(`/public/archetypes/${archetypeId}`)
      .then((response) => {
        if (response.status === 202) {
          setRefresh(true);
          toast.success(`Vous avez supprimé l'archetype ${archetypeName}`);
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="">
      <div className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <PaginationTableHead tableHeadItem={tableHeadItemArray} />
        <AdminArchetypePaginationTableBody
          arrayItems={archetypes}
          toggleHighlighted={toggleHighlighted}
          toggleIsActive={toggleIsActive}
          deleteArchetype={deleteArchetype}
        />
      </div>
      <PaginationFooter
        pagination={pagination}
        setPagination={setPagination}
        setRefresh={setRefresh}
        itemArraySize={archetypesTotalCount}
        displayingNumberSize={displayingNumberSize}
      />
    </div>
  );
};

export default AdminArchetypePagination;
