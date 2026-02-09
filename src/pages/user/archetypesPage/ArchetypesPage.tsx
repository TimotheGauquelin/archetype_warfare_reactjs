import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/Archetypes.scss";
import { FaRandom } from "react-icons/fa";
import AbsoluteInput from "../../../components/generic/AbsoluteInput";
import PageContentBlock from "../../../components/generic/PageContentBlock";
import ArchetypeList from "../../../components/pages/home/ArchetypeList";
import {
  getArchetypesWithCriteria,
  getRandomArchetype,
} from "../../../services/archetype";
import SelectInput from "../../../components/generic/form/SelectInput";
import { Input } from "../../../components/generic/form/input/Input";
import Button from "../../../components/generic/buttons/classicButton/Button";
import { laborIllusion } from "../../../utils/functions/laborIllusion/laborIllusion";
import type { Archetype } from "../../../types";
import UserHeroLayout from "../layout";
import { useEras } from "../../../hooks/useEras";
import { useDebounce } from "@/utils/functions/debounce/useDebounce";

const ArchetypesPage = () => {
  const [archetypes, setArchetypes] = useState<Archetype[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const { eras } = useEras();
  const [filters, setFilters] = useState({
    name: "",
    era: "",
    size: 12,
    page: 0
  });
  const [, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 12,
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const debouncedName = useDebounce(filters.name, 500);

  const handleRandomArchetype = useCallback(() => {
    setIsLoading(true);

    laborIllusion(async () => {
      try {
        await getRandomArchetype(navigate);
      } finally {
        setIsLoading(false);
      }
    }, 0.5);
  }, [navigate]);

  const loadData = useCallback(async () => {
    try {
      setIsFetching(true);
      const searchFilters = {
        name: debouncedName,
        era: filters.era,
        size: filters.size,
        page: filters.page
      };
      await getArchetypesWithCriteria(searchFilters, setArchetypes, setPagination, (v) => setErrorMessage(prev => typeof v === 'function' ? (v as (p: string) => string)(prev ?? '') : v));
    } catch (err) {
      console.log("Erreur lors du chargement des archétypes");
    } finally {
      setIsFetching(false);
    }
  }, [debouncedName, filters.era, filters.size, filters.page]);


  useEffect(() => {
    loadData();
  }, [loadData]);

  const eraOptions = useMemo(() => eras, [eras]);

  const isRandomButtonDisabled = useMemo(() => {

    const hasNameFilter = filters.name.trim() !== "";
    const hasEraFilter = filters.era !== "";
    const hasNoData = archetypes.length === 0;

    return hasNameFilter || hasEraFilter || hasNoData;
  }, [filters.name, filters.era, archetypes]);

  return (
    <UserHeroLayout
      mainTitle="Trouvez votre archétype"
      subTitle={`Parmi plus d'une centaine de familles de cartes`}
    >
      <AbsoluteInput>
        <Input
          inputType="text"
          inputName="name"
          colSpanWidth="6"
          attribute="name"
          data={filters}
          setAction={setFilters}
          placeholder="Quel archetype recherchez-vous ?"
        />
        <SelectInput
          options={eraOptions}
          inputName="era"
          colSpanWidth="4"
          attribute="era"
          data={filters as Record<string, unknown>}
          defaultOptionLabel="De quelle ère est votre archetype ?"
          setAction={setFilters as React.Dispatch<React.SetStateAction<Record<string, unknown>>>}
        />
        <div className="col-span-2">
          <Button
            style={{ backgroundColor: "#F95757" }}
            className="h-full w-full p-2 rounded-md flex justify-center items-center text-white"
            action={handleRandomArchetype}
            disabled={isLoading || isRandomButtonDisabled}
          >
            <FaRandom />
          </Button>
        </div>
      </AbsoluteInput>
      <PageContentBlock>
        <ArchetypeList
          dataArray={archetypes}
          isFetching={isFetching}
          skeletonItemCount={8}
          errorMessage={errorMessage}
        />
      </PageContentBlock>
    </UserHeroLayout>
  );
};

export default ArchetypesPage;
