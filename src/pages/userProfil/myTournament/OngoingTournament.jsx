import React from "react";
import Header from "../../../components/generic/header/Header";
import Navbar from "../../../components/pages/userProfil/Navbar";
import ProfilTemplate from "../../../components/pages/userProfil/ProfilTemplate";

const OngoingTournament = () => {
  return (
    <div>
      <Header />
      <Navbar />
      <ProfilTemplate>
        <div className="flex justify-between">
          <p className="font-bold text-xl">Tournoi de Lille</p>
          <div className="flex items-center">
            <p className="font-bold">Statut: </p>
            <div className="bg-orange-300 ml-1 p-1 rounded">En cours</div>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex">
            <p>Format: </p>
            <p>Ronde Suisse</p>
          </div>
          <div className="flex">
            <p>Nb de rounds: </p>
            <p>9</p>
          </div>
        </div>
        <div className="text-center text-xl font-bold">
          <p>SCORE :</p>
          <p>4-1-1</p>
        </div>
        <div>
          <div>
            <p className="font-bold">Manche en cours : </p>
            <div className="bg-blue-300 rounded p-1">
              <div className="flex">
                <p className="font-bold">Match N° 7</p>
                <p>(Table 4)</p>
              </div>
              <p>Adversaire: Timothé Gauquelin</p>
              <div className="bg-gray-100 p-1 rounded">
                <p className="font-bold">Résultat :</p>
                <div className="flex grid grid-cols-12">
                  <div className="col-span-3">
                    <input
                      type="radio"
                      id="won"
                      name="match_result"
                      value="won"
                    />
                    <label for="won">Gagné !</label>
                  </div>

                  <div className="col-span-3">
                    <input
                      type="radio"
                      id="lost"
                      name="match_result"
                      value="lost"
                    />
                    <label for="lost">Perdu !</label>
                  </div>

                  <div className="col-span-3">
                    <input
                      type="radio"
                      id="draw"
                      name="match_result"
                      value="draw"
                    />
                    <label for="draw">Egalité !</label>
                  </div>
                  <button className="col-span-3 bg-green-300 hover:bg-green-400 rounded">
                    Envoyer
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div>
            <p className="font-bold">Historique des matchs : </p>
            <div className="bg-blue-300 rounded p-1 mb-2">
              <div className="flex">
                <p className="font-bold">Match N° 6</p>
                <p>(Table 12)</p>
              </div>
              <p>Adversaire: Yann Miossec </p>
              <p>Résultat: Gagné !</p>
            </div>
            <div className="bg-blue-300 rounded p-1 mb-2">
              <div className="flex">
                <p className="font-bold">Match N° 5</p>
                <p>(Table 7)</p>
              </div>
              <p>Adversaire: Alexandre Leblond </p>
              <p>Résultat: Perdu !</p>
            </div>
            <div className="bg-blue-300 rounded p-1 mb-2">
              <div className="flex">
                <p className="font-bold">Match N° 4</p>
                <p>(Table 12)</p>
              </div>
              <p>Adversaire: Maxime Lesur </p>
              <p>Résultat: Gagné !</p>
            </div>
          </div>
        </div>
      </ProfilTemplate>
    </div>
  );
};

export default OngoingTournament;
