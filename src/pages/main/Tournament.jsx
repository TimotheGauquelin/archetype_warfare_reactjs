import React, { useEffect, useState } from "react";
import Header from "../../components/generic/header/Header";
import Jumbotron from "../../components/generic/Jumbotron";
import PageContentBlock from "../../components/generic/PageContentBlock";
import { useParams } from "react-router-dom";
import api_aw from "../../api/api_aw";
import { useSelector } from "react-redux";
import jwt_decode from "jwt-decode";
import {
  convertJavaDateIntoJS,
  switchEnumSystemTournament,
} from "../../constant/genericMethod";
import { ToastContainer, toast } from "react-toastify";

const Tournament = () => {
  const [tournament, setTournament] = useState({});
  const [refresh, setRefresh] = useState(false);
  const { id } = useParams();
  const { token } = useSelector((state) => state.user);
  var decoded = jwt_decode(token);
  var userStatusInsideTournament = tournament?.players?.find(
    (player) => player.id === decoded.idUser
  );
  
  const getTournament = () => {
    api_aw.get(`/public/tournaments/${id}`).then((response) => {
      if (response.status === 200) {
        setTournament(response.data);
      }
    });
  };

  const addOrRemoveUserToTournament = () => {
    try {
      api_aw
        .put(`public/tournament/${tournament.id}/addOrRemoveSubscription`, "", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          if (response.status === 200) {
            setRefresh(true);
          }
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTournament();
    setRefresh(false);
  }, [refresh]);

  return (
    <div>
      <div id="headBlock" className="imgBackground">
        <Header />
        <Jumbotron
          mainTitle={tournament.name}
          subTitle={`Ville: ${tournament.city} - Nombre de joueurs: ${tournament.nbPlayer}`}
          // itemImg={archetype.jumbotronImg}
        />
      </div>
      <div>
        <PageContentBlock>
          <div className="bg-blue-100 rounded p-2 my-2">
            <div className="flex justify-between">
              <p className="font-bold text-xl">
                Informations Supplémentaires :
              </p>
              {tournament.status === "DID_NOT_START" ? (
                <button
                  className={`${
                    userStatusInsideTournament
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-blue-500 hover:bg-blue-600"
                  } rounded p-2 text-white`}
                  onClick={() => {
                    addOrRemoveUserToTournament();
                  }}
                >
                  {userStatusInsideTournament
                    ? "Me retirer du tournoi"
                    : "Participer au tournoi"}
                </button>
              ) : tournament.status === "ON_GOING" ? (
                <div className="bg-green-400 p-1 rounded text-white">
                  Tournoi en cours
                </div>
              ) : (
                <div className="bg-gray-400 p-1 rounded text-white">
                  Tournoi terminé
                </div>
              )}
            </div>
            <div className="flex">
              <p className="font-bold">Format du Tournoi :</p>
              <p>{switchEnumSystemTournament(tournament.systemTournament)}</p>
            </div>
            <div className="flex">
              <p className="font-bold ">Date de l'évènement :</p>
              <p>{convertJavaDateIntoJS(tournament.startDate)}</p>
            </div>
            <div className="flex">
              <p className="font-bold ">Lieu de l'évènement :</p>
              <p>
                {tournament.city} - {tournament.address}{" "}
              </p>
            </div>
            {tournament.message && (
              <div className="">
                <p className="font-bold ">Message :</p>
                <p>{tournament.message}</p>
              </div>
            )}
          </div>
          <div>
            <p className="font-bold text-xl">Liste des participants :</p>
            <div className="grid grid-cols-12 gap-4 py-2">
              {tournament?.players
                ?.sort((a, b) => {
                  return a.username.localeCompare(b.username);
                })
                .map((player, index) => {
                  return (
                    <div
                      className="col-span-6 flex justify-between bg-gray-200 rounded p-2"
                      key={index}
                    >
                      <p>{player.username}</p>
                      <p>Voir profil</p>
                    </div>
                  );
                })}
            </div>
          </div>
        </PageContentBlock>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Tournament;
