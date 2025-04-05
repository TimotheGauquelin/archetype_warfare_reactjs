import React, { useEffect, useState } from "react";
import AdminBodyHeader from "../../../components/pages/admin/AdminBodyHeader";
import AdminStructure from "../../../components/pages/admin/AdminStructure";
import AdminArchetypeFilter from "../../../components/pages/admin/archetype/AdminArchetypeFilter";
import AdminArchetypePagination from "../../../components/pages/admin/archetype/AdminArchetypePagination";
import { toast, ToastContainer } from "react-toastify";
import { getArchetypesWithCriteria } from "../../../services/archetype";
import { URL_FRONT_ADMIN_ARCHETYPE_ADD_FORM } from "../../../constant/urlsFront";

const AdminArchetype = () => {
  const [archetypes, setArchetypes] = useState([]);
  const [pagination, setPagination] = useState(1);
  const [pageSize] = useState(10);
  const [criteria, setCriteria] = useState({
    name: "",
    era: "",
    type: "",
    attribute: "",
    summonmechanic: "",
  });
  const [refresh, setRefresh] = useState(false);

  const resetAllFilters = () => {
    setCriteria({
      name: "",
      era: "",
      type: "",
      attribute: "",
      summonmechanic: "",
    });
    toast.success("Vous avez mis les filtres à leur état d'origine.");
  };

  console.log(archetypes);

  useEffect(() => {
    getArchetypesWithCriteria(
      pageSize,
      pagination,
      criteria,
      setArchetypes
    );
    setRefresh(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, criteria]);

  return (
    <AdminStructure>
      <AdminBodyHeader
        label="Archetype"
        catchphrase="Vous avez des archétypes de toute sorte"
        buttonUrl={URL_FRONT_ADMIN_ARCHETYPE_ADD_FORM}
        buttonLabel="Ajouter un archetype"
      />
      <AdminArchetypeFilter
        resetAllFilters={() => resetAllFilters()}
        criteria={criteria}
        setCriteria={setCriteria}
        refresh={refresh}
        setRefresh={setRefresh}
      />
      <AdminArchetypePagination
        setRefresh={setRefresh}
        currentPage={archetypes.currentPage}
        archetypes={archetypes}
        setPagination={setPagination}
        archetypesTotalCount={archetypes?.totalItems}
        totalPages={archetypes?.totalPages}
        pageSize={archetypes.pageSize}
      />
      <ToastContainer />
    </AdminStructure>
  );
};

export default AdminArchetype;
