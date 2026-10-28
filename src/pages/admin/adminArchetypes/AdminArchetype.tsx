import { useEffect, useState } from "react";
import AdminBodyHeader from "../../../components/pages/admin/AdminBodyHeader";
import AdminStructure from "../adminLayout";
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
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    void Promise.resolve(
      getArchetypesWithCriteria(
        filters,
        setArchetypes,
        setPagination,
        setErrorMessage
      )
    ).finally(() => {
      setLoading(false);
      setRefresh(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, filters]);

  return (
    <AdminStructure>
      <AdminBodyHeader
        label="Archétypes"
        catchphrase="Filtres, mise en ligne et édition des archétypes"
        buttonUrl={URL_FRONT_ADMIN_ARCHETYPE_ADD_FORM}
        buttonLabel="Ajouter un archetype"
      />

      <section className="bg-white border border-gray-200 rounded-lg p-2.5 tablet:p-4 shadow-sm mb-6 tablet:mb-10 space-y-3 overflow-hidden">
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
          setPagination={(page: number) => {
            setFilters((prev) => ({ ...prev, page }));
            setPagination((prev) => ({ ...prev, currentPage: page }));
          }}
          archetypesTotalCount={pagination?.total}
          totalPages={pagination?.totalPages}
          pageSize={pagination?.pageSize}
          loading={loading}
          showConfirmPopupDialog={showConfirmDialog}
        />
      </section>

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
