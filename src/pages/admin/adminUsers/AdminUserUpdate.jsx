import React from 'react'
import AdminStructure from '../../../components/pages/admin/AdminStructure';
import AdminBodyHeader from '../../../components/pages/admin/AdminBodyHeader';
import { ToastContainer } from 'react-toastify';
import AdminUserUpdateForm from '../../../components/pages/admin/users/AdminUserUpdateForm';

const AdminUserUpdate = () => {
    return (
        <AdminStructure>
            <AdminBodyHeader
                label="Modifier un utilisateur"
                catchphrase=""
                returnButton
            />
            <AdminUserUpdateForm />
            <ToastContainer />
        </AdminStructure>
    );
}

export default AdminUserUpdate