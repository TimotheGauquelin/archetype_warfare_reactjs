import { useEffect, useState } from "react";
import AdminBodyHeader from "../../../components/pages/admin/AdminBodyHeader";
import AdminStructure from "../../../components/pages/admin/AdminStructure";
import AdminArchetypeFilter from "../../../components/pages/admin/archetype/AdminArchetypeFilter";
import AdminArchetypePagination from "../../../components/pages/admin/archetype/AdminArchetypePagination";
import { toast, ToastContainer } from "react-toastify";
import { getArchetypesWithCriteria } from "../../../services/archetype";
import { URL_FRONT_ADMIN_ARCHETYPE_ADD_FORM } from "../../../constant/urlsFront";

const AdminArchetype = () => {
  const [archetypes, setArchetypes] = useState([
    {
      attributes: [],
      comment: "",
      created_at: null,
      era: {},
      era_id: "",
      id: "",
      in_aw_date: "",
      in_tcg_date: "",
      is_active: true,
      is_highlighted: true,
      main_info: "",
      name: "",
      popularity_poll: "",
      slider_info: "",
      summon_mechanics: [],
      types: [],
      updated_at: null
    }
  ]);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 30,
  });
  const [filters, setFilters] = useState({
    name: "",
    era: "",
    type: "",
    attribute: "",
    summonmechanic: "",
    page: 1,
    size: 30,
  });
  const [refresh, setRefresh] = useState(false);

  const resetAllFilters = () => {
    setFilters({
      name: "",
      era: "",
      type: "",
      attribute: "",
      summonmechanic: "",
    });
    toast.success("Vous avez mis les filtres à leur état d'origine.");
  };

  useEffect(() => {
    getArchetypesWithCriteria(filters, setArchetypes, setPagination);
    setRefresh(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, filters]);

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
        criteria={filters}
        setCriteria={setFilters}
        refresh={refresh}
        setRefresh={setRefresh}
      />
      <AdminArchetypePagination
        setRefresh={setRefresh}
        currentPage={pagination?.currentPage}
        archetypes={archetypes}
        setPagination={setPagination}
        archetypesTotalCount={pagination?.total}
        totalPages={pagination?.totalPages}
        pageSize={pagination?.pageSize}
      />
      <ToastContainer />
    </AdminStructure>
  );
};

export default AdminArchetype;
