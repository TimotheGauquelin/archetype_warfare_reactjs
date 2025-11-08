import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Header from "../../../components/generic/header/Header";
import Navbar from "../../../components/pages/userProfil/Navbar";
import ProfilTemplate from "../../../components/pages/userProfil/ProfilTemplate";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import { getMyDecks } from "../../../services/deck";
import { URL_FRONT_MY_DECK_ADD } from "../../../constant/urlsFront";
import Button from "../../../components/generic/Button";

const MyDecks = () => {
  const [myDecks, setMyDecks] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const { id, token } = useSelector((state) => state.user);

  console.log(myDecks);

  const navigate = useNavigate();

  useEffect(() => {
    getMyDecks(token, id, setMyDecks, setIsFetching);
  }, []);

  return (
    <div>
      <Header />
      <Navbar />
      <ProfilTemplate>
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex flex-row justify-between items-center mb-2">

            <h3 className="text-xl font-bold text-black">Tous mes decks :</h3>
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold transition-all duration-200 shadow-sm"
              buttonText="Ajouter un deck"
              action={() => navigate(URL_FRONT_MY_DECK_ADD)}
            />
          </div>
          {
            isFetching ? (
              <div className="grid grid-cols-1 sscreen:grid-cols-2 lscreen:grid-cols-4 gap-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="p-4 bg-gray-300 rounded-lg animate-pulse h-20"></div>
                ))}
              </div>
            ) : (
              <div className={`grid gap-2 ${myDecks?.length > 0 ? "grid-cols-12" : ""}`}>
                {myDecks?.length > 0
                  ? myDecks?.map((deck, deckIndex) => {
                    return (
                      <Link
                        key={deckIndex}
                        className="p-4 bg-blue-200 rounded-lg col-span-3"
                        to={`/my-decks/update/${deck.id}`}
                      >
                        <div>{deck.label}</div>
                      </Link>
                    );
                  })
                  :
                  (
                    <p className="text-gray-700 bg-gray-200 rounded-lg p-2">
                      Vous n'avez aucun deck pour le moment.
                    </p>
                  )
                }
              </div>
            )
          }
          <Link
            to="/"
            className="block bg-blue-200 absolute right-0 p-5 shadow rounded-full sscreen:hidden"
          >
            <FaPlus />
          </Link>
        </div>
      </ProfilTemplate>
    </div>
  );
};

export default MyDecks;
