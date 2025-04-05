import React, { useState } from 'react'
import AdminStructure from '../../../components/pages/admin/AdminStructure';
import { ToastContainer } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { addArchetype } from '../../../services/archetype';
import AdminBodyHeader from '../../../components/pages/admin/AdminBodyHeader';
import AdminArchetypeSwitchButtons from "../../../components/pages/admin/archetype/AdminArchetypePaginationTableBody"
import AdminArchetypeFormik from "../../../components/pages/admin/archetype/AdminArchetypeFormik"

const AdminArchetypeAdd = () => {
    const location = useLocation();
    const navigate = useNavigate();
  
    const [newArchetype, setNewArchetype] = useState({
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
      summonmechanics: [],
      cards: []
    });
  
    return (
      <AdminStructure>
        <AdminBodyHeader
          label="Ajouter un archétype"
          catchphrase=""
          returnButton
        />
        <AdminArchetypeSwitchButtons
          location={location}
        />
        <AdminArchetypeFormik
          newArchetype={newArchetype}
          setNewArchetype={setNewArchetype}
          addArchetype={() => {addArchetype(newArchetype, navigate)}}
        />
        <ToastContainer />
      </AdminStructure>
    );
}

export default AdminArchetypeAdd