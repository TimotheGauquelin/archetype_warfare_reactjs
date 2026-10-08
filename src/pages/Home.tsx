import { useEffect, useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Header from "../components/generic/header/Header";
import Slider from "../components/generic/Slider";

import "../styles/Home.scss";
import PageContentBlock from "../components/generic/PageContentBlock";
import ArchetypeList from "../components/pages/home/ArchetypeList";
import {
  getEightMostRecentArchetypes,
  getEightMostFamousArchetypes,
  getFiveRandomHighlightedArchetypes,
} from "../services/archetype";
import Footer from "../components/generic/footer/Footer";
import type { Archetype, RootState } from "../types";

const Home: React.FC = () => {
  const { t } = useTranslation();
  const locale = useSelector((state: RootState) => state.locale?.value ?? "fr");
  const [fiveMostFamousArchetypes, setFiveMostFamousArchetypes] = useState<Archetype[]>([]);
  const [eightMostRecentArchetypes, setEightMostRecentArchetypes] = useState<Archetype[]>([]);
  const [archetypesForSlider, setArchetypesForSlider] = useState<Archetype[]>([]);
  const [, setHasError] = useState<boolean>(false);
  const [isListsLoading, setIsListsLoading] = useState<boolean>(true);

  const welcomeArchetype: Archetype = useMemo(
    () => ({
      id: 0,
      name: t("home.welcomeTitle"),
      nameSubtitle: t("home.welcomeSubtitle"),
      isWelcome: true,
      slider_img_url: `${import.meta.env.BASE_URL}assets/yugi.webp`,
      slider_info: t("home.welcomeMessage"),
    }),
    [t]
  );

  const loadData = useCallback(async () => {
    setHasError(false);
    setIsListsLoading(true);

    const sliderPromise = getFiveRandomHighlightedArchetypes(setArchetypesForSlider, () => {});
    const listsPromise = Promise.all([
      getEightMostFamousArchetypes(setFiveMostFamousArchetypes, () => {}),
      getEightMostRecentArchetypes(setEightMostRecentArchetypes, () => {}),
    ]);

    try {
      await Promise.all([sliderPromise, listsPromise]);
    } catch {
      setHasError(true);
    } finally {
      setIsListsLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    // Laisse peindre le LCP (yugi.webp) avant les appels API
    const t = window.setTimeout(() => {
      loadData();
    }, 100);
    return () => window.clearTimeout(t);
  }, [loadData]);

  const slidesToDisplay = useMemo(() => {
    const highlighted = archetypesForSlider.filter((a) => a.is_highlighted);
    if (highlighted.length === 0) {
      return [welcomeArchetype];
    }
    return [welcomeArchetype, ...highlighted];
  }, [archetypesForSlider, welcomeArchetype]);

  return (
    <div>
      <div id="headBlock" className="imgBackground overflow-visible">
        <Header />
        <Slider array={slidesToDisplay} slidesPerView={1} />
      </div>
      <PageContentBlock>
        <ArchetypeList
          dataArray={fiveMostFamousArchetypes}
          subTitleDividerText={t("home.popularArchetypes")}
          haveMedal
          isFetching={isListsLoading}
          skeletonItemCount={8}
        />
        <ArchetypeList
          dataArray={eightMostRecentArchetypes}
          subTitleDividerText={t("home.newArchetypes")}
          isFetching={isListsLoading}
          skeletonItemCount={8}
          displayDate
        />
      </PageContentBlock>
      <Footer />
    </div>
  );
};

export default Home;
