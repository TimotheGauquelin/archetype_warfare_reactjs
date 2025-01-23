import React from "react";
import Header from "../../../components/generic/header/Header";
import Navbar from "../../../components/pages/userProfil/Navbar";
import ProfilTemplate from "../../../components/pages/userProfil/ProfilTemplate";
import { Link } from "react-router-dom";

const MyTournaments = () => {
  return (
    <div>
      <Header />
      <Navbar />
      <ProfilTemplate>
        <div className="py-2">
          <p>En Cours :</p>
          <Link
            to={`/my-tournaments/on-going/1`}
            // state={{ tournament: tournament }}
            // key={index}
          >
            <div className="grid grid-cols-12 bg-blue-300 rounded my-1 p-1">
              <div className="col-span-6">Tournoi de Lille</div>
              <div className="col-span-3">10-10-2023</div>
              <div className="col-span-3">Lille</div>
            </div>
          </Link>
        </div>
        <div className="py-2">
          <p>Mes Tournois A Venir :</p>
          <div className="grid grid-cols-12 bg-blue-300 rounded my-1 p-1">
            <div className="col-span-6">Tournoi de Lille</div>
            <div className="col-span-3">10-10-2023</div>
            <div className="col-span-3">Lille</div>
          </div>
          <div className="grid grid-cols-12 bg-blue-300 rounded my-1 p-1">
            <div className="col-span-6">Tournoi de Paris</div>
            <div className="col-span-3">10-10-2023</div>
            <div className="col-span-3">Paris</div>
          </div>
        </div>
        <div className="flex items-center justify-between py-2">
          <p>Mon Historique :</p>
        </div>
      </ProfilTemplate>
    </div>
  );
};

export default MyTournaments;
