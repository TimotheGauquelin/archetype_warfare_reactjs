import React, { useEffect, useState } from "react";
import AdminBodyHeader from "../../../components/pages/admin/AdminBodyHeader";
import AdminStructure from "../../../components/pages/admin/AdminStructure";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { getArchetypeById, updateArchetype } from "../../../services/archetype";
import AdminArchetypeUpdateFormik from "../../../components/pages/admin/archetype/AdminArchetypeUpdateFormik";

const AdminArchetypeUpdatePage = () => {
  const navigate = useNavigate();
  const { archetypeId } = useParams();

  const [archetype, setArchetype] = useState({
    name: "",
    main_info: "",
    slider_info: "",
    comment: "",
    is_highlighted: false,
    is_active: false,
    era_id: "",
    popularity_poll: "0",
    in_tcg_date: "1970-01-01",
    in_aw_date: "1970-01-01",
    attributes: [],
    types: [],
    summonmechanics: [],
    cards: [],
  });

  console.log(archetype)

  useEffect(() => {
    getArchetypeById(archetypeId, setArchetype);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        updateArchetype={() => { updateArchetype(archetypeId, archetype, navigate) }}
      />
      <ToastContainer />
    </AdminStructure>
  );
};

export default AdminArchetypeUpdatePage;
