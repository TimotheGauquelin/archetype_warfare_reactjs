import { useState, useCallback } from 'react';
import AdminStructure from '../../../components/pages/admin/AdminStructure';
import { useNavigate } from 'react-router-dom';
import { addArchetype } from '../../../services/archetype';
import AdminBodyHeader from '../../../components/pages/admin/AdminBodyHeader';
import AdminArchetypeForm from "../../../components/pages/admin/archetype/AdminArchetypeForm"
import { toast } from 'react-toastify';
import { laborIllusion } from '../../../utils/functions/laborIllusion/laborIllusion';
import type { Archetype } from '../../../types';

const AdminArchetypeAdd = () => {
  const navigate = useNavigate();

  const [newArchetype, setNewArchetype] = useState<Archetype>({
    id: 0,
    name: "",
    main_info: "",
    slider_info: "",
    comment: "",
    slider_img_url: "",
    card_img_url: "",
    is_highlighted: false,
    is_active: false,
    era: undefined,
    popularity_poll: 0,
    in_tcg_date: "2002-01-01",
    in_aw_date: new Date().toISOString().split('T')[0], // today
    attributes: [],
    types: [],
    summon_mechanics: [],
    cards: []
  } as Archetype);
  
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