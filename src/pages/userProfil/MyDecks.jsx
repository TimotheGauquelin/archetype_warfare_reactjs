import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import api_aw from "../../api/api_aw";
import Header from "../../components/generic/header/Header";
import Navbar from "../../components/pages/userProfil/Navbar";
import ProfilTemplate from "../../components/pages/userProfil/ProfilTemplate";
import jwt_decode from "jwt-decode";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";

const MyDecks = () => {
  const [myDecks, setMyDecks] = useState([]);
  const { token } = useSelector((state) => state.user);
  var decoded = jwt_decode(token);

  const getMyDecks = () => {
    api_aw.get(`/public/decks/user/${decoded.idUser}`).then((response) => {
      if (response.status === 200) {
        setMyDecks(response.data);
      }
    });
  };

  useEffect(() => {
    getMyDecks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Header />
      <Navbar />
      <ProfilTemplate>
        <div className="flex items-center justify-between py-2">
          <p>Tous mes decks :</p>
          <Link
            to="/my-decks/add"
            className="p-2 bg-blue-200 rounded hidden sscreen:block "
          >
            <div>Ajouter un deck</div>
          </Link>
        </div>
        <div className="grid grid-cols-1 sscreen:grid-cols-2 lscreen:grid-cols-4 gap-4 relative">
          {myDecks?.length > 0
            ? myDecks?.map((deck, deckIndex) => {
                return (
                  <Link
                    key={deckIndex}
                    className="p-4 bg-white rounded-lg"
                    to={`/my-decks/${deck.id}`}
                    state={{ request: "put" }}
                  >
                    <div>{deck.label}</div>
                  </Link>
                );
              })
            : "Vous n'avez aucun deck pour le moment"}
        </div>
        <Link
          to="/"
          className="block bg-blue-200 absolute right-0 p-5 shadow rounded-full sscreen:hidden"
        >
          <FaPlus />
        </Link>
      </ProfilTemplate>
    </div>
  );
};

export default MyDecks;
