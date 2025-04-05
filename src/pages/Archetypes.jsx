import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/generic/header/Header";
import "../styles/Archetypes.scss";
import { FaRandom } from "react-icons/fa";
import Jumbotron from "../components/generic/Jumbotron";
import AbsoluteInput from "../components/generic/AbsoluteInput";
import PageContentBlock from "../components/generic/PageContentBlock";
import ArchetypeList from "../components/pages/home/ArchetypeList";
import { getArchetypesWithCriteria } from "../services/archetype";
import { getEras } from "../services/era";
import { getSummonMechanics } from "../services/summonmechanic";
import SelectInput from "../components/generic/form/SelectInput";
import { Input } from "../components/generic/form/Input";

const Archetypes = () => {
  const [archetypes, setArchetypes] = useState([]);
  const [eras, setEras] = useState([]);
  const [summonMechanics, setSummonMechanics] = useState([]);
  const [randomArchetype, setRandomArchetype] = useState({});
  const [countArchetypes, setCountArchetypes] = useState(0);

  const [criteria, setCriteria] = useState({
    name: "",
    era: "",
    summonmechanic: "",
  });

  // const getAllGenericData = () => {
  //   axios
  //     .all([
  //       api_aw.get(URL_BACK_GET_RANDOM_ARCHETYPE),
  //       api_aw.get(URL_BACK_GET_COUNT_NUMBER_OF_ARCHETYPE_ACTIVE),
  //     ])
  //     .then((respArr) => {
  //       if (respArr[0].status === 200) {
  //         setRandomArchetype(respArr[0].data);
  //       }
  //       if (respArr[1].status === 200) {
  //         setCountArchetypes(respArr[1].data);
  //       }
  //       setDataIsLoaded(true);
  //     });
  // };

  useEffect(() => {
    getArchetypesWithCriteria(100, 1, criteria, setArchetypes);
    getEras(setEras);
    getSummonMechanics(setSummonMechanics);
    // getAllGenericData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criteria]);

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
            <Input
              inputType="text"
              inputName="name"
              colSpanWidth="5"
              attribute="name"
              data={criteria.name}
              setAction={setCriteria}
            />
            <SelectInput
              className="m-2 p-2"
              options={eras}
              inputName="era"
              colSpanWidth="5"
              attribute="era"
              data={criteria.era}
              setAction={setCriteria}
            />
            {/* <SelectInput
              className="m-2 p-2"
              options={summonMechanics}
              inputName="summonmechanic"
              colSpanWidth="3"
              attribute="summonmechanic"
              data={criteria.summonmechanic}
              setAction={setCriteria}
            /> */}
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
      {/* {dataIsLoaded ? ( */}
      <PageContentBlock>
        <div className="flex flex-col justify-center w-full">
          <ArchetypeList
            dataArray={archetypes.archetypes}
            errorText="Il n'y a pas d'archetype dans cette selection."
            errorTextCenter
          />
        </div>
      </PageContentBlock>
      {/* ) : (
        <Loader />
      )} */}
    </div>
  );
};

export default Archetypes;
