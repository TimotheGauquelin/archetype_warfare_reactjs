import React, { useEffect, useState } from "react";
import api_aw from "../../../api/api_aw";
import AdminBodyHeader from "../../../components/pages/admin/AdminBodyHeader";
import AdminStructure from "../../../components/pages/admin/AdminStructure";
import AdminArchetypeFilter from "../../../components/pages/admin/archetype/AdminArchetypeFilter";
import AdminArchetypePagination from "../../../components/pages/admin/archetype/AdminArchetypePagination";
import { toast, ToastContainer } from "react-toastify";

const AdminArchetype = () => {
  const [archetypes, setArchetypes] = useState();
  const [archetypesTotalCount, setArchetypesTotalCount] = useState();
  const [pagination, setPagination] = useState(0);
  const [displayingNumberSize, setDisplayingNumberSize] = useState(10);
  const [criteriaName, setCriteriaName] = useState("");
  const [criteriaEra, setCriteriaEra] = useState("");
  const [criteriaType, setCriteriaType] = useState("");
  const [criteriaAttribute, setCriteriaAttribute] = useState("");
  const [criteriaSummonMechanic, setCriteriaSummonMechanic] = useState("");
  const [refresh, setRefresh] = useState(false);

  const getArchetypes = () => {
    api_aw
      .get(
        `/public/archetypesWithCriteria?size=${displayingNumberSize}&page=${pagination}&name=${criteriaName}&era=${criteriaEra}&attributes=${criteriaAttribute}&types=${criteriaType}&summonMechanics=${criteriaSummonMechanic}`
      )
      .then((response) => {
        if (response.status === 200) {
          setArchetypes(
            response?.data.sort(function (a, b) {
              return (a?.name).localeCompare(b?.name);
            })
          );
          setArchetypesTotalCount(response.headers["x-total-count"]);
        }
      });
  };

  const resetAllFilters = () => {
    setCriteriaEra("");
    setCriteriaName("");
    setCriteriaType("");
    setCriteriaAttribute("");
    setCriteriaSummonMechanic("");
    toast.success("Vous avez mis les filtres à leur état d'origine.");
  };

  useEffect(() => {
    getArchetypes();
    setRefresh(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    refresh,
    criteriaName,
    criteriaEra,
    criteriaAttribute,
    criteriaType,
    criteriaSummonMechanic,
  ]);

  return (
    <AdminStructure>
      <AdminBodyHeader
        label="Archetype"
        catchphrase="Vous avez des archétypes de toute sorte"
        buttonUrl="/admin/archetypes/form"
        buttonLabel="Ajouter un archetype"
      />

      <AdminArchetypeFilter
        resetAllFilters={() => resetAllFilters()}
        criteriaName={criteriaName}
        setCriteriaName={setCriteriaName}
        criteriaEra={criteriaEra}
        setCriteriaEra={setCriteriaEra}
        criteriaAttribute={criteriaAttribute}
        setCriteriaAttribute={setCriteriaAttribute}
        criteriaType={criteriaType}
        setCriteriaType={setCriteriaType}
        criteriaSummonMechanic={criteriaSummonMechanic}
        setCriteriaSummonMechanic={setCriteriaSummonMechanic}
        setRefresh={setRefresh}
      />

      <AdminArchetypePagination
        setRefresh={setRefresh}
        archetypes={archetypes}
        pagination={pagination}
        setPagination={setPagination}
        archetypesTotalCount={archetypesTotalCount}
        displayingNumberSize={displayingNumberSize}
      />
      <ToastContainer />
    </AdminStructure>
  );
};

export default AdminArchetype;
