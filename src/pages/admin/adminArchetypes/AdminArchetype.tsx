import { useEffect, useState } from "react";
import AdminBodyHeader from "../../../components/pages/admin/AdminBodyHeader";
import AdminStructure from "../../../components/pages/admin/AdminStructure";
import AdminArchetypeFilter from "../../../components/pages/admin/archetype/AdminArchetypeFilter";
import AdminArchetypePagination from "../../../components/pages/admin/archetype/AdminArchetypePagination";
import { toast } from "react-toastify";
import { getArchetypesWithCriteria } from "../../../services/archetype";
import { URL_FRONT_ADMIN_ARCHETYPE_ADD_FORM } from "../../../constant/urlsFront";
import PopUp from "../../../components/generic/PopUp";
import usePopup from "../../../hooks/usePopup";
import type { Archetype, SearchCriteria } from "../../../types";

const AdminArchetype = () => {
  const [archetypes, setArchetypes] = useState<Archetype[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 30,
  });
  const [filters, setFilters] = useState<SearchCriteria>({
    name: "",
    era: "",
    type: "",
    attribute: "",
    summonmechanic: "",
    page: 1,
    size: 30,
  });
  const [_errorMessage, setErrorMessage] = useState("");
  const [refresh, setRefresh] = useState(false);

  const resetAllFilters = () => {
    setFilters({
      name: "",
      era: "",
      type: "",
      attribute: "",
      summonmechanic: "",
      page: 1,
      size: 30,
    });
    toast.success("Vous avez mis les filtres à leur état d'origine.");
  };

  const { isOpen, popupConfig, closePopup, showConfirmDialog } = usePopup();

  useEffect(() => {
    getArchetypesWithCriteria(filters, setArchetypes, setPagination, setErrorMessage);
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
        setRefresh={setRefresh}
      />
      <AdminArchetypePagination
        setRefresh={setRefresh}
        currentPage={pagination?.currentPage}
        archetypes={archetypes}
        setPagination={(page: number) => setPagination((prev) => ({ ...prev, currentPage: page }))}
        archetypesTotalCount={pagination?.total}
        totalPages={pagination?.totalPages}
        pageSize={pagination?.pageSize}
        showConfirmPopupDialog={showConfirmDialog}
      />
      <PopUp
        isOpen={isOpen}
        onClose={closePopup}
        title={popupConfig.title}
        className={popupConfig.className}
        showCloseButton={popupConfig.showCloseButton}
        closeOnBackdropClick={popupConfig.closeOnBackdropClick}
      >
        {popupConfig.content}
      </PopUp>
    </AdminStructure>
  );
};

export default AdminArchetype;
