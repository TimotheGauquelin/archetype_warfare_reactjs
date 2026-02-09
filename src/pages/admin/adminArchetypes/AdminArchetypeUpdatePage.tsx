import { useEffect, useState } from "react";
import AdminBodyHeader from "../../../components/pages/admin/AdminBodyHeader";
import AdminStructure from "../../../components/pages/admin/AdminStructure";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { getArchetypeById, updateArchetype } from "../../../services/archetype";
import AdminArchetypeUpdateFormik from "../../../components/pages/admin/archetype/AdminArchetypeUpdateFormik";
import { laborIllusion } from "../../../utils/functions/laborIllusion/laborIllusion";
import type { Archetype } from "../../../types";

const AdminArchetypeUpdatePage = () => {
  const navigate = useNavigate();
  const { archetypeId } = useParams();

  const [archetype, setArchetype] = useState<Archetype>({
    id: 0,
    name: "",
    main_info: "",
    slider_info: "",
    comment: "",
    is_highlighted: false,
    is_active: false,
    era_id: "",
    popularity_poll: 0,
    in_tcg_date: "1970-01-01",
    in_aw_date: "1970-01-01",
    attributes: [],
    types: [],
    summon_mechanics: [],
    cards: [],
  } as Archetype);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    if (archetypeId) getArchetypeById(archetypeId, setArchetype);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [archetypeId]);

  return (
    <AdminStructure>
      <AdminBodyHeader
        label={`Modifier l'archetype ${archetype.name}`}
        catchphrase=""
        returnButton
      />
      {/* <AdminArchetypeSwitchButtons
        location={location}
      /> */}
      <AdminArchetypeUpdateFormik
        archetype={archetype}
        setArchetype={setArchetype}
        updateArchetype={() => {
          if (!archetypeId) return;
          setIsLoading(true);
          laborIllusion(() => updateArchetype(archetypeId, archetype, navigate, toast, setIsLoading), 1);
        }}
        isLoading={isLoading}
      />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
      />
    </AdminStructure>
  );
};

export default AdminArchetypeUpdatePage;
