import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import AdminStructure from '../../../components/pages/admin/AdminStructure';
import AdminBodyHeader from '../../../components/pages/admin/AdminBodyHeader';
import { getBanlistById } from '../../../services/banlist';
import { getCardTypes } from '../../../services/cardtype';
import { getCardStatus } from '../../../services/cardStatus';

const AdminUpdateBanlist = () => {

    const [banlist, setBanlist] = useState({});
    const [cardTypes, setCardTypes] = useState([]);
    const [cardStatus, setCardStatus] = useState([]);
    const { banlistId } = useParams();

    useEffect(() => {
        getBanlistById(Number(banlistId), setBanlist);
        getCardTypes(setCardTypes);
        getCardStatus(setCardStatus);
    }, [banlistId]);

    console.log(banlist);

    return (
        <AdminStructure>
            <AdminBodyHeader
                label="Modifier une banlist"
                catchphrase="Gérez les cartes et leurs statuts"
                returnButton
            />
        </AdminStructure>
    )
}

export default AdminUpdateBanlist