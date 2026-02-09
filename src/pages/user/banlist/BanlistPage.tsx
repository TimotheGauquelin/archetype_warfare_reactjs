import { useCallback, useEffect, useState, useMemo } from "react";
import AbsoluteInput from "../../../components/generic/AbsoluteInput";
import PageContentBlock from "../../../components/generic/PageContentBlock";
import CardsSection from "../../../components/generic/CardsSection";
import { getCurrentBanlist } from "../../../services/banlist";
import { STATUS_FORBIDDEN, STATUS_LIMITED, STATUS_SEMI_LIMITED } from "../../../utils/const/banlistConst";
import { sortArchetypeCards } from "../../../utils/functions/sortCards";
import { useCardTypes } from "../../../hooks/useCardTypes";
import { useDebounce } from "../../../utils/functions/debounce/useDebounce";
import "../../../styles/Archetypes.scss";
import type { Banlist as BanlistType, BanlistCard, SetStateCallback, Banlist } from "../../../types";
import UserHeroLayout from "../layout";


const BanlistPage = () => {
  const [banlistSearchInput, setBanlistSearchInput] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [banlist, setBanlist] = useState<BanlistType | null>(null);
  const { cardTypes } = useCardTypes();
  const debouncedSearchInput = useDebounce(banlistSearchInput, 300);

  const loadBanlistData = useCallback(async () => {
    setIsFetching(true);

    try {
      await getCurrentBanlist(setBanlist as SetStateCallback<Banlist>);
    } catch (err) {
      console.error("Erreur:", err);
    } finally {
      setIsFetching(false);
    }
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setBanlistSearchInput(e.target.value);
  }, []);


  const sortedCards = useMemo(() => {
    if (!banlist?.banlist_archetype_cards || !cardTypes.length) return [];
    return sortArchetypeCards(banlist.banlist_archetype_cards, cardTypes);
  }, [banlist?.banlist_archetype_cards, cardTypes.length]);

  const cardsByStatus = useMemo(() => {
    const forbidden: BanlistCard[] = [];
    const limited: BanlistCard[] = [];
    const semiLimited: BanlistCard[] = [];

    const searchLower = debouncedSearchInput.toLowerCase().trim();
    const filteredCards = searchLower
      ? sortedCards.filter((card) =>
          card.card?.name?.toLowerCase().includes(searchLower)
        )
      : sortedCards;

    filteredCards.forEach(card => {
      const cardStatus = card.card_status?.label.toLowerCase();
      switch (cardStatus) {
        case STATUS_FORBIDDEN.toLowerCase():
          forbidden.push(card);
          break;
        case STATUS_LIMITED.toLowerCase():
          limited.push(card);
          break;
        case STATUS_SEMI_LIMITED.toLowerCase():
          semiLimited.push(card);
          break;
      }
    });

    return { forbidden, limited, semiLimited };
  }, [sortedCards, debouncedSearchInput]);

  useEffect(() => {
    loadBanlistData();
  }, [loadBanlistData]);

  return (
    <UserHeroLayout
      mainTitle="Faîtes attention aux cartes interdites !"
      subTitle="Archetype Warfare propose une toute nouvelle banlist de cartes génériques, en plus de celles des archétypes"
    >
      <AbsoluteInput>
        <input
          type="text"
          className="col-span-12 bg-gray-100 rounded-md p-2"
          placeholder="Quelle carte recherchez-vous ?"
          value={banlistSearchInput}
          onChange={handleSearchChange}
          aria-label="Rechercher une carte"
        />
      </AbsoluteInput>
      <PageContentBlock>
          <CardsSection
            title="Cartes Interdites"
            cards={cardsByStatus.forbidden}
            isFetching={isFetching}
          />

          <CardsSection
            title="Cartes Limitées"
            cards={cardsByStatus.limited}
            isFetching={isFetching}
          />

          <CardsSection
            title="Cartes Semi-Limitées"
            cards={cardsByStatus.semiLimited}
            isFetching={isFetching}
          />
      </PageContentBlock>
    </UserHeroLayout>
  );
};

export default BanlistPage;
