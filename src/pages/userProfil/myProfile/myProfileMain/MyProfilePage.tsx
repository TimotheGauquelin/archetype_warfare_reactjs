import Button from "../../../../components/generic/buttons/classicButton/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import usePopup from "../../../../hooks/usePopup";
import PopUp from "../../../../components/generic/PopUp";
import { deleteUser } from "../../../../services/user";
import { FaCrown } from "react-icons/fa";
import type { RootState } from "../../../../types";
import type { Role } from "../../../../types";
import UserProfilLayout from "../../layout";
import { URL_FRONT_MY_PROFILE_EDIT } from "@/constant/urlsFront";
import UserProfileLayoutTitle from "@/components/generic/UserProfileLayoutTitle";

const MyProfile = () => {
  const { isOpen, popupConfig, closePopup, showConfirmDialog } = usePopup();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id, username, roles } = useSelector((state: RootState) => state.user);

  const handleDeleteUser = () => {
    if (!id) return;
    showConfirmDialog({
      title: "Supprimer votre compte",
      message: "Cette action est irréversible. Êtes-vous sûr de vouloir supprimer votre compte ?",
      onConfirm: () => { deleteUser(id, dispatch, navigate) }
    });
  };

  return (
    <UserProfilLayout>
      <div className="bg-white rounded-lg shadow-sm p-4 mb-2">
        <UserProfileLayoutTitle
          title="Informations du compte"
          buttonUrl={URL_FRONT_MY_PROFILE_EDIT}
          buttonText="Modifier mes informations"
          buttonClassName="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold transition-all duration-200 shadow-sm"
        />

        <div className="space-y-2 mb-2">
          <div className="grid grid-cols-12 space-y-2">
            <div className="col-span-12 md:col-span-6 flex flex-col space-y-1">
              <p className="font-semibold text-black mb-1">Nom d'utilisateur :</p>
              <p className="text-black">{username}</p>
            </div>
            <div className="col-span-12 md:col-span-6 flex flex-col space-y-1">
              <p className="font-semibold text-black mb-2">Rôle(s):</p>
              <div className="flex flex-wrap gap-1">
                {roles?.map((role: Role | string, index: number) => {
                  const roleLabel = typeof role === 'string' ? role : role.label;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white font-bold rounded-md shadow-sm"
                    >
                      <FaCrown className="text-xs" />
                      <span>{roleLabel}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 space-y-2">
            <div className="col-span-12 md:col-span-6 flex flex-col space-y-1">
              <p className="font-semibold text-black">Archétype favori :</p>
              <p className="text-black">Aucun</p>
            </div>
          </div>
        </div>
        <div className="bg-red-200 rounded-lg p-4 space-y-2">
          <h3 className="text-lg font-bold text-red-500 flex items-center gap-1">
            Zone de danger
          </h3>
          <p className="text-base">
            La suppression de votre compte entraînera la perte définitive de toutes vos données
          </p>
          <Button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold transition-all duration-200 shadow-sm"
            buttonText="Supprimer mon compte"
            action={handleDeleteUser}
          />
        </div>
      </div>
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
    </UserProfilLayout>
  );
};

export default MyProfile;
