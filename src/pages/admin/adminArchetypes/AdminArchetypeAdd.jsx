import React, { useState, useCallback } from 'react'
import AdminStructure from '../../../components/pages/admin/AdminStructure';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { addArchetype } from '../../../services/archetype';
import AdminBodyHeader from '../../../components/pages/admin/AdminBodyHeader';
import AdminArchetypeForm from "../../../components/pages/admin/archetype/AdminArchetypeForm"

const AdminArchetypeAdd = () => {
  const navigate = useNavigate();

  const [newArchetype, setNewArchetype] = useState({
    name: "",
    main_info: "",
    slider_info: "",
    comment: "",
    is_highlighted: false,
    is_active: false,
    era: null,
    popularity_poll: 0,
    in_tcg_date: "1970-01-01",
    in_aw_date: "1970-01-01",
    attributes: [],
    types: [],
    summon_mechanics: [],
    cards: []
  });

  // Utiliser useCallback pour éviter la recréation de la fonction à chaque render
  const handleAddArchetype = useCallback(() => {
    addArchetype(newArchetype, navigate);
  }, [newArchetype, navigate]);

  return (
    <AdminStructure>
      <AdminBodyHeader
        label="Ajouter un archétype"
        catchphrase=""
        returnButton
      />
      <AdminArchetypeForm
        newArchetype={newArchetype}
        setNewArchetype={setNewArchetype}
        addArchetype={handleAddArchetype}
      />
      <ToastContainer />
    </AdminStructure>
  );
}

export default AdminArchetypeAdd