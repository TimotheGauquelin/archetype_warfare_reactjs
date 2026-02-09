import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../../../components/generic/header/Header";
import SubtitleDivider from "../../../components/generic/SubtitleDivider";
import MainInformationsBlock from "../../../components/pages/archetype/MainInformationsBlock";
import Jumbotron from "../../../components/pages/archetype/Jumbotron";
import "../../../styles/Archetype.scss";
import PageContentBlock from "../../../components/generic/PageContentBlock";
import { getArchetypeById } from "../../../services/archetype";
import Card from "../../../components/generic/Card";
import SkeletonArchetypePage from "../../../components/skeletons/SkeletonArchetypePage";
import Footer from "../../../components/generic/footer/Footer";
import "../../../styles/Home.scss";
import type { Archetype } from "../../../types";
import NoItemMessage from "@/components/generic/NoItemMessage";
import { sortArchetypeCards } from "../../../utils/functions/sortCards";
import UserHeroLayout from "../layout";
import { URL_FRONT_HOME } from "@/constant/urlsFront";
import { useCardTypes } from "../../../hooks/useCardTypes";

const ArchetypePage = () => {
  const [archetype, setArchetype] = useState<Archetype | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const { id } = useParams();
  const { cardTypes } = useCardTypes();

  const navigate = useNavigate();

  const loadArchetypeData = useCallback(async () => {
    if (!id) {
      setErrorMessage("ID d'archétype manquant");
      setIsFetching(false);
      return;
    }

    setIsFetching(true);
    setErrorMessage(null);

    try {
      // Wrapper pour adapter le type SetStateCallback<Archetype> à setArchetype qui accepte Archetype | null
      const setArchetypeWrapper = (value: Archetype | ((prev: Archetype) => Archetype)) => {
        if (typeof value === 'function') {
          setArchetype((prev) => prev ? value(prev) : null);
        } else {
          setArchetype(value);
        }
      };

      await getArchetypeById(id, setArchetypeWrapper);
    } catch (err) {
      const errorMessage = "Erreur lors du chargement de l'archétype. Veuillez réessayer plus tard.";
      setErrorMessage(errorMessage);
      console.error("Erreur lors du chargement de l'archétype:", err);
    } finally {
      setIsFetching(false);
    }
  }, [id]);

  const sortedCards = useMemo(() => {
    if (!archetype?.cards) return [];
    return sortArchetypeCards(archetype.cards, cardTypes);
  }, [archetype?.cards, cardTypes]);

  useEffect(() => {
    loadArchetypeData();
  }, [loadArchetypeData]);

  useEffect(() => {
    if (errorMessage || (!isFetching && (!archetype || !archetype.id))) {
      const timer = setTimeout(() => {
        navigate(URL_FRONT_HOME);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage, archetype, isFetching, navigate]);

  if (isFetching) {
    return <SkeletonArchetypePage />;
  }

  if (errorMessage || !archetype || !archetype.id) {
    return (
      <UserHeroLayout
        mainTitle="Erreur:Archétype introuvable"
        subTitle="Vous allez être redirigé vers la page d'accueil dans 3 secondes..."
      >
        <></>
      </UserHeroLayout>
    );
  }

  return (
    <div>
      <div id="headBlock" className="w-full imgBackground overflow-visible sscreen:bg-contain bg-no-repeat bg-center sscreen:bg-right-bottom relative">
        <Header />
        <Jumbotron
          itemMainTitle={archetype.name}
          itemSubTitle={typeof archetype.main_info === 'string' ? archetype.main_info : ''}
          itemImg={archetype.slider_img_url}
        />
        <div className="relative px-3 pb-3 sscreen:p-0 lscreen:max-w-containerSize m-auto">
          <MainInformationsBlock
            archetype={archetype}
          />
        </div>
      </div>

      <PageContentBlock>
        <div className={`flex flex-col w-full justify-center max-w-containerSize m-auto ${archetype.comment && 'pt-8'}`}>
          {archetype.comment != null && String(archetype.comment) && (
            <div className="bg-blue-100 flex-col text-blue-500 p-3 font-medium rounded-lg flex mb-4">
              <span data-testid="archetype-comment">{`Information : ${String(archetype.comment)}`}</span>
              <p className="text-right text-sm">Le Staff AW</p>
            </div>
          )}
          <div className="pt-5">
            <SubtitleDivider
              label={`Toutes les cartes (${sortedCards.length})`}
              displayDivider
            />
          </div>
          {
            sortedCards.length > 0 ? (
              <div className="bg-gray-100 p-4 grid grid-cols-12 gap-4 mb-4 border border-gray-200 rounded-lg">
                {sortedCards.map((card) => (
                  <Card key={card.card.id} card={card} />
                ))}
              </div>
            ) : (
              <NoItemMessage
                message="Il n'y a pas de carte dans cet archétype."
                textPosition="center"
              />
            )
          }
        </div>
      </PageContentBlock>
      <Footer />
    </div>
  );
};

export default ArchetypePage;
