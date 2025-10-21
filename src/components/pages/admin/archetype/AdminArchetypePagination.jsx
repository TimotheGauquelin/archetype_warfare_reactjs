import React from "react";
import AdminArchetypePaginationTableBody from "./AdminArchetypePaginationTableBody";
import PaginationTableHead from "../../../generic/pagination/PaginationTableHead";
import PaginationFooter from "../../../generic/pagination/PaginationFooter";
import {
  deleteArchetype,
  switchIsActive,
  switchIsHighlighted,
} from "../../../../services/archetype";

const AdminArchetypePagination = ({
  setRefresh,
  archetypes,
  currentPage,
  setPagination,
  archetypesTotalCount,
  totalPages,
  pageSize,
  showConfirmPopupDialog,
}) => {

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

  const handleDeleteArchetypeButton = (archetypeId) => {
    console.log("HELLO");
    showConfirmPopupDialog({
      title: "Suppresion de l'archetype",
      message: "Êtes vous sûr de vouloir supprimer cet archetype ? Cette action est irréversible.",
      onConfirm: () => {
        deleteArchetype(archetypeId, setRefresh);
      }
    });
  };

  return (
    <div className="">
      <div className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <PaginationTableHead tableHeadItem={tableHeadItemArray} />
        <AdminArchetypePaginationTableBody
          arrayItems={archetypes}
          switchIsHighlighted={switchIsHighlighted}
          switchIsActive={switchIsActive}
          deleteArchetype={handleDeleteArchetypeButton}
          setRefresh={setRefresh}
        />
      </div>
      <PaginationFooter
        setRefresh={setRefresh}
        currentPage={currentPage}
        setPagination={setPagination}
        itemsTotalCount={archetypesTotalCount}
        totalPages={totalPages}
        pageSize={pageSize}
      />
    </div>
  );
};

export default AdminArchetypePagination;
