import React, { useState, useCallback } from 'react'
import AdminStructure from '../../../components/pages/admin/AdminStructure';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { addArchetype } from '../../../services/archetype';
import AdminBodyHeader from '../../../components/pages/admin/AdminBodyHeader';
import AdminArchetypeForm from "../../../components/pages/admin/archetype/AdminArchetypeForm"
import { toast } from 'react-toastify';
import { laborIllusion } from '../../../utils/functions/laborIllusion';

const AdminArchetypeAdd = () => {
  const navigate = useNavigate();

  const [newArchetype, setNewArchetype] = useState({
    name: "",
    main_info: "",
    slider_info: "",
    comment: "",
    slider_img_url: "",
    card_img_url: "",
    is_highlighted: false,
    is_active: false,
    era: null,
    popularity_poll: 0,
    in_tcg_date: "2002-01-01",
    in_aw_date: new Date().toISOString().split('T')[0], // today
    attributes: [],
    types: [],
    summon_mechanics: [],
    cards: []
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleAddArchetype = useCallback(() => {
    setIsLoading(true);
    laborIllusion(() => {
      addArchetype(newArchetype, navigate, toast);
      setIsLoading(false);
    }, 2);
  }, [newArchetype, navigate, toast]);

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
        isLoading={isLoading}
      />
    </AdminStructure>
  );
}

export default AdminArchetypeAdd