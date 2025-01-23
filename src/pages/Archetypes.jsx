import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api_aw from "../api/api_aw";
import Header from "../components/generic/header/Header";
import "../styles/Archetypes.scss";
import { FaRandom } from "react-icons/fa";
import Jumbotron from "../components/generic/Jumbotron";
import AbsoluteInput from "../components/generic/AbsoluteInput";
import PageContentBlock from "../components/generic/PageContentBlock";
import { useDispatch, useSelector } from "react-redux";
import { searchEras } from "../redux/apiCall/era";
import { searchSummonMechanics } from "../redux/apiCall/summonMechanic";
import ArchetypeList from "../components/pages/home/ArchetypeList";
import axios from "axios";
import {
  URL_BACK_GET_COUNT_NUMBER_OF_ARCHETYPE_ACTIVE,
  URL_BACK_GET_RANDOM_ARCHETYPE,
} from "../constant/urlsBack";
import Loader from "../components/generic/Loader";

const Archetypes = () => {
  const dispatch = useDispatch();
  const [selectedName, setSelectedName] = useState("");
  const [selectedEra, setSelectedEra] = useState("");
  const [selectedSummonMechanic, setSelectedSummonMechanic] = useState("");
  const [archetypes, setArchetypes] = useState([]);
  const [randomArchetype, setRandomArchetype] = useState({});
  const [countArchetypes, setCountArchetypes] = useState(0);
  const [dataIsLoaded, setDataIsLoaded] = useState(false);

  const { eras } = useSelector((state) => state.eras);
  const { summonMechanics } = useSelector((state) => state.summonMechanics);

  const getArchetypesWithCriterias = () => {
    api_aw
      .get(
        `/public/archetypesWithCriteria?name=${selectedName}&era=${selectedEra}&summonMechanics=${selectedSummonMechanic}`
      )
      .then((response) => {
        if (response.status === 200) {
          setArchetypes(
            response.data
              .filter((archetype) => archetype.isActive === true)
              .sort(function (a, b) {
                return ("" + a?.name).localeCompare(b?.name);
              })
          );
        }
      });
  };

  const getAllGenericData = () => {
    axios
      .all([
        api_aw.get(URL_BACK_GET_RANDOM_ARCHETYPE),
        api_aw.get(URL_BACK_GET_COUNT_NUMBER_OF_ARCHETYPE_ACTIVE),
      ])
      .then((respArr) => {
        if (respArr[0].status === 200) {
          setRandomArchetype(respArr[0].data);
        }
        if (respArr[1].status === 200) {
          setCountArchetypes(respArr[1].data);
        }
        setDataIsLoaded(true);
      });
  };

  useEffect(() => {
    searchEras(dispatch);
    searchSummonMechanics(dispatch);
    getArchetypesWithCriterias();
    getAllGenericData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEra, selectedSummonMechanic, selectedName]);

  return (
    <div className="flex flex-col">
      <div id="headBlock" className="imageBackground">
        <Header />
        <div className="relative p-3 lscreen:max-w-containerSize m-auto">
          <Jumbotron
            mainTitle="Trouvez votre archétype"
            subTitle={
              countArchetypes >= 1
                ? `Parmi plus de ${countArchetypes} familles de cartes`
                : "Il n'y a aucun archétype"
            }
          />
          <AbsoluteInput>
            <input
              className="col-span-4 m-2 p-2"
              type="text"
              placeholder="Nom de l'archétype"
              value={selectedName}
              onChange={(e) => setSelectedName(e.target.value)}
            />
            <select
              className="col-span-3 m-2 p-2"
              name=""
              id=""
              value={selectedEra}
              onChange={(e) => {
                setSelectedEra(e.target.value);
              }}
            >
              <option value="">-- Ere --</option>
              {eras.map((era, index) => {
                return (
                  <option key={era.label + index} value={era.label}>
                    {era.label}
                  </option>
                );
              })}
            </select>
            <select
              className="col-span-4 m-2 p-2"
              name=""
              id=""
              value={selectedSummonMechanic}
              onChange={(e) => {
                setSelectedSummonMechanic(e.target.value);
              }}
            >
              <option className="m-2 p-2" value="">
                -- Méthode d'invocation --
              </option>
              {summonMechanics.map((summonMechanic, index) => {
                return (
                  <option
                    className="m-2 p-2"
                    key={summonMechanic.label + index}
                    value={summonMechanic.label}
                  >
                    {summonMechanic.label}
                  </option>
                );
              })}
            </select>
            <Link
              to={`/archetypes/${randomArchetype?.id}`}
              state={{ id: randomArchetype.id }}
              style={{ backgroundColor: "#F95757" }}
              className="col-span-1 p-2 rounded-lg  flex justify-center items-center text-white"
            >
              <FaRandom />
            </Link>
          </AbsoluteInput>
        </div>
      </div>
      {dataIsLoaded ? (
        <PageContentBlock>
          <div className="flex flex-col justify-center w-full">
            <ArchetypeList
              dataArray={archetypes}
              errorText="Il n'y a pas d'archetype dans cette selection."
              errorTextCenter
            />
          </div>
        </PageContentBlock>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default Archetypes;
