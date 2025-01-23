import React, { useEffect, useState } from "react";
import Header from "../../components/generic/header/Header";
import Jumbotron from "../../components/generic/Jumbotron";
import CardsBlock from "../../components/generic/PageContentBlock";
import { Link } from "react-router-dom";
import AbsoluteInput from "../../components/generic/AbsoluteInput";
import api_aw from "../../api/api_aw";
import { convertJavaDateIntoJS } from "../../constant/genericMethod";
import NoItemMessage from "../../components/generic/NoItemMessage";

const Tournaments = () => {
  const [tournaments, setTournaments] = useState([]);

  const getTournaments = () => {
    api_aw
      .get(
        // `/public/tournamentsWithCriteria?name=${selectedName}&city=${selectedCity}`
        `/public/tournaments`
      )
      .then((response) => {
        if (response.status === 200) {
          setTournaments(response.data);
        }
      });
  };

  useEffect(() => {
    getTournaments();
  }, []);

  return (
    <div className="flex flex-col">
      <div id="headBlock" className="imageBackground">
        <Header />
        <div className="relative p-3 lscreen:max-w-containerSize m-auto">
          <Jumbotron
            mainTitle="Trouvez un tournoi près de chez vous !"
            subTitle=""
          />
          <AbsoluteInput>
            <input
              className="col-span-6 m-2 p-2"
              type="text"
              placeholder="Nom du tournois"
            />
            <input
              className="col-span-6 m-2 p-2"
              type="text"
              placeholder="Ville"
            />
          </AbsoluteInput>
        </div>
      </div>
      <div>
        {/* {dataIsLoaded ? ( */}
        <CardsBlock>
          {tournaments.length > 0 ? (
            <div className="flex flex-col justify-center w-full">
              <div className="">
                <div className="grid grid-cols-12 border-y-4 text-center font-bold text-xl">
                  <div className="col-span-5">Nom de l'event</div>
                  <div className="col-span-2">Nb de Joueurs</div>
                  <div className="col-span-2">Date</div>
                  <div className="col-span-3">Lieu</div>
                </div>
                {tournaments?.map((tournament, index) => {
                  return (
                    <Link to={`/tournament/${tournament.id}`} key={index}>
                      <div className="grid grid-cols-12 border-b text-center">
                        <div className="col-span-5">{tournament.name}</div>
                        <div className="col-span-2">{`${tournament.players.length} / ${tournament.nbPlayer}`}</div>
                        <div className="col-span-2">
                          {convertJavaDateIntoJS(tournament.startDate)}
                        </div>
                        <div className="col-span-3">{tournament.city}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : (
            <NoItemMessage message="Il n'y a aucun tournoi de prévu." />
          )}
        </CardsBlock>
        {/* ) : (
          <Loader />
        )} */}
      </div>
    </div>
  );
};

export default Tournaments;
