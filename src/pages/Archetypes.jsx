import { useEffect, useState } from "react";
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

  console.log(archetypes)

  const navigate = useNavigate();

  useEffect(() => {
    getArchetypesWithCriteria(filters, setArchetypes, setPagination);
    getEras(setEras);
  }, [filters]);

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
              colSpanWidth="5"
              attribute="name"
              data={filters.name}
              setAction={setFilters}
            />
            <SelectInput
              className="m-2 p-2"
              options={eras}
              inputName="era"
              colSpanWidth="5"
              attribute="era"
              data={filters.era}
              setAction={setFilters}
            />
            <button
              style={{ backgroundColor: "#F95757" }}
              className="col-span-1 p-2 rounded-lg  flex justify-center items-center text-white"
              onClick={() => {
                getRandomArchetype(navigate);
              }}
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
