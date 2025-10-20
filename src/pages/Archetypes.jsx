import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/generic/header/Header";
import "../styles/Archetypes.scss";
import { FaRandom } from "react-icons/fa";
import Jumbotron from "../components/generic/Jumbotron";
import AbsoluteInput from "../components/generic/AbsoluteInput";
import PageContentBlock from "../components/generic/PageContentBlock";
import ArchetypeList from "../components/pages/home/ArchetypeList";
import {
  getArchetypesWithCriteria,
  getRandomArchetype,
} from "../services/archetype";
import { getEras } from "../services/era";
import SelectInput from "../components/generic/form/SelectInput";
import { Input } from "../components/generic/form/Input";

const Archetypes = () => {
  const [archetypes, setArchetypes] = useState([]);
  const [pagination, setPagination] = useState({
    size: 10,
    page: 0,
    totalElements: 0,
    totalPages: 0,
  });
  const [eras, setEras] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    era: "",
    size: 10,
    page: 0
  });

  const navigate = useNavigate();

  const handleRandomArchetype = useCallback(() => {
    getRandomArchetype(navigate);
  }, [navigate]);

  useEffect(() => {
    getArchetypesWithCriteria(filters, setArchetypes, setPagination);
    getEras(setEras);
  }, [filters]);

  const eraOptions = useMemo(() => eras, [eras]);

  return (
    <div className="flex flex-col">
      <div id="headBlock" className="imageBackground">
        <Header />
        <div className="relative p-3 lscreen:max-w-containerSize m-auto">
          <Jumbotron
            mainTitle="Trouvez votre archétype"
            subTitle={`Parmi plus d'une centaine de familles de cartes`}
          />
          <AbsoluteInput>
            <Input
              inputType="text"
              inputName="name"
              colSpanWidth="6"
              attribute="name"
              data={filters.name}
              setAction={setFilters}
              placeholder="Quel archetype recherchez-vous ?"
            />
            <SelectInput
              className="p-2"
              options={eraOptions}
              inputName="era"
              colSpanWidth="4"
              attribute="era"
              data={filters.era}
              defaultOptionLabel="De quelle ère est votre archetype ?"
              setAction={setFilters}
            />
            <button
              style={{ backgroundColor: "#F95757" }}
              className="col-span-2 p-2 rounded-md  flex justify-center items-center text-white"
              onClick={handleRandomArchetype}
            >
              <FaRandom />
            </button>
          </AbsoluteInput>
        </div>
      </div>
      {/* {dataIsLoaded ? ( */}
      <PageContentBlock>
        <div className="flex flex-col justify-center w-full">
          <ArchetypeList
            dataArray={archetypes}
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
