import React, { useEffect, useState } from "react";
import Header from "../../components/generic/header/Header";
import Navbar from "../../components/pages/userProfil/Navbar";
import ProfilTemplate from "../../components/pages/userProfil/ProfilTemplate";
import Button from "../../components/generic/Button";
import PopUp from "../../components/generic/PopUp";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import usePopup from "../../hooks/usePopup";
import { deleteUser } from "../../services/user";
import api_aw from "../../api/api_aw";
import { FaCrown, FaTrophy, FaChartLine, FaClock } from "react-icons/fa";

const MyProfil = () => {
  const { isOpen, showConfirmDialog, closePopup, popupConfig } = usePopup();
  const navigate = useNavigate();
  const { id, username, roles, email } = useSelector((state) => state.user);

  const [userStats, setUserStats] = useState({
    totalDecks: 0,
    favoriteArchetype: null,
    lastLogin: null,
    memberSince: null,
    winRate: 0,
    totalBattles: 0,
  });

  const getUserStats = () => {
    // Récupération des statistiques de l'utilisateur
    api_aw.get(`/public/users/${id}/stats`)
      .then((response) => {
        if (response.status === 200) {
          setUserStats(response.data);
        }
      })
      .catch((error) => {
        console.log("Erreur lors du chargement des stats:", error);
      });
  };

  useEffect(() => {
    getUserStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteUser = () => {
    showConfirmDialog({
      title: "Supprimer votre compte",
      message: "Cette action est irréversible. Êtes-vous sûr de vouloir supprimer votre compte ?",
      onConfirm: () => { deleteUser(id, navigate) }
    });
  };

  return (
    <div>
      <Header />
      <Navbar />
      <ProfilTemplate>
        {/* Informations de base */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex flex-row justify-between items-center mb-4">

            <h3 className="text-xl font-bold mb-4 text-black">Informations du compte</h3>
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold transition-all duration-200 shadow-sm"
              buttonText="Modifier mes informations"
              action={() => navigate("/my-profil/edit")}
            />
          </div>

          <div className="">
            <div className="grid grid-cols-12">
              <div className="col-span-12 md:col-span-6 mb-4 flex flex-col">
                <p className="font-semibold text-black mb-1">Nom d'utilisateur :</p>
                <p className="text-black">{username}</p>
              </div>
              <div className="col-span-12 md:col-span-6 mb-4 flex flex-col">
                <p className="font-semibold text-black mb-2">Rôle(s):</p>
                <div className="flex flex-wrap gap-2">
                  {roles?.map((role, index) => {
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-1 bg-red-500 text-white font-bold rounded-md shadow-sm"
                      >
                        <FaCrown className="text-xs" />
                        <span>{role}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12">
              <div className="col-span-12 md:col-span-6 mb-4 flex flex-col">
                <p className="font-semibold text-black mb-1">Archétype favori :</p>
                <p className="text-black">{userStats.favoriteArchetype ? userStats.favoriteArchetype : "Aucun"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-red-200 rounded-lg p-4">
          <h3 className="text-xl font-bold mb-4 text-red-500 flex items-center gap-2">
            Zone de danger
          </h3>
          <p className="text-sm mb-4">
            La suppression de votre compte entraînera la perte définitive de toutes vos données
          </p>
          <Button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold transition-all duration-200 shadow-sm"
            buttonText="Supprimer mon compte"
            action={handleDeleteUser}
          />
        </div>
      </ProfilTemplate>

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
    </div>
  );
};

export default MyProfil;
