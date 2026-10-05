import Button from "../../../../components/generic/buttons/classicButton/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import usePopup from "../../../../hooks/usePopup";
import PopUp from "../../../../components/generic/PopUp";
import { deleteUser } from "../../../../services/user";
import { FaCrown } from "react-icons/fa";
import type { RootState } from "../../../../types";
import UserProfilLayout from "../../layout";
import UserProfileLayoutTitle from "@/components/generic/UserProfileLayoutTitle";

const MyProfile = () => {
  const { t } = useTranslation();
  const { isOpen, popupConfig, closePopup, showConfirmDialog } = usePopup();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id, username, roles } = useSelector((state: RootState) => state.user);

  const handleDeleteUser = () => {
    if (!id) return;
    showConfirmDialog({
      title: t("profile.deleteAccountTitle"),
      message: t("profile.deleteAccountConfirm"),
      onConfirm: () => { deleteUser(id, dispatch, navigate) }
    });
  };

  return (
    <UserProfilLayout>
      <div className="bg-white rounded-lg shadow-sm p-4 mb-2">
        <UserProfileLayoutTitle
          title={t("profile.accountInfo")}
        />

        <div className="space-y-2 mb-2">
          <div className="grid grid-cols-12 space-y-2">
            <div className="col-span-12 md:col-span-6 flex flex-col space-y-1">
              <p className="font-semibold text-black mb-1">{t("profile.username")}</p>
              <p className="text-black">{username}</p>
            </div>
            <div className="col-span-12 md:col-span-6 flex flex-col space-y-1">
              <p className="font-semibold text-black">{t("profile.roles")}</p>
              <div className="flex flex-wrap gap-1">
                {roles?.map((role: any, index: number) => {
                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-1 px-3 py-1 ${role?.toLowerCase() === "admin" ? "bg-red-500" : "bg-green-500"} text-white font-bold rounded-md shadow-sm`}
                    >
                      {role?.toLowerCase() === "admin" && <FaCrown className="text-xs" />}
                      <span>{role}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-red-200 rounded-lg p-4 space-y-2">
          <h3 className="text-lg font-bold text-red-500 flex items-center gap-1">
            {t("profile.dangerZone")}
          </h3>
          <p className="text-base">
            {t("profile.dangerZoneDesc")}
          </p>
          <Button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold transition-all duration-200 shadow-sm"
            buttonText={t("profile.deleteAccount")}
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
