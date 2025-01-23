import React from "react";
import Header from "../../components/generic/header/Header";
import Navbar from "../../components/pages/userProfil/Navbar";
import ProfilTemplate from "../../components/pages/userProfil/ProfilTemplate";

const MyDeckProfil = () => {
  return (
    <div>
      <Header />
      <Navbar />
      <ProfilTemplate>
        <div className="flex items-center justify-between py-2">
          <p>Tous mes decks :</p>
        </div>
      </ProfilTemplate>
    </div>
  );
};

export default MyDeckProfil;
