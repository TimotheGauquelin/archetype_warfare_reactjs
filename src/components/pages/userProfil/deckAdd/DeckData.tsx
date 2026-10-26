import React from 'react'
import { useTranslation } from 'react-i18next';
import type { Deck, Archetype } from '../../../../types';
import { Input } from '@/components/generic/form/input/Input';
import TextArea from '@/components/generic/form/textArea/TextArea';
import SelectInput from '@/components/generic/form/SelectInput';
import { withRecomputedDeckCardLegality } from '@/utils/deck/deckCardLegality';

interface DeckDataProps {
    myDeck: Deck;
    setMyDeck: React.Dispatch<React.SetStateAction<Deck>>;
    archetypes: Archetype[];
}

const DeckData: React.FC<DeckDataProps> = ({ myDeck, setMyDeck, archetypes }) => {
    const { t } = useTranslation();

    const handleArchetypeSelect: React.Dispatch<React.SetStateAction<Deck>> = (value) => {
        setMyDeck((prev) => {
            const next = typeof value === "function" ? value(prev) : value;
            const selectedId = next.archetype_id != null
                ? Number(next.archetype_id)
                : 0;
            const selectedArchetype = archetypes.find(
                (archetype) => Number(archetype.id) === selectedId
            );

            return {
                ...next,
                archetype_id: selectedId || undefined,
                archetype: {
                    ...next.archetype,
                    id: selectedId,
                    label: selectedArchetype?.name ?? "",
                    card_img_url: selectedArchetype?.card_img_url ?? next.archetype?.card_img_url,
                    is_active: selectedArchetype?.is_active ?? next.archetype?.is_active,
                },
                deck_cards: withRecomputedDeckCardLegality(
                    next.deck_cards,
                    selectedId || undefined
                ),
            };
        });
    };

    return (
        <div data-testid="deck-data" className="p-1 sscreen:p-4 bg-gray-300 rounded-lg">
            <span className="block font-bold text-lg mb-1 sscreen:mb-2">
                {t("profile.deckInfo")}
            </span>
            {
                myDeck.archetype?.is_active === false && (
                    <p className="mb-1 sscreen:mb-2 p-1 sscreen:p-2 bg-yellow-100 text-yellow-800 rounded-md text-sm font-semibold">
                        {t("profile.archetypeInactiveWarning")}
                    </p>
                )
            }
            <div className="grid grid-cols-2 gap-1 sscreen:gap-4 [&_label]:mt-1 sscreen:[&_label]:mt-2 [&_input]:mt-1 sscreen:[&_input]:mt-2 [&>div]:!mt-0 sscreen:[&>div]:!mt-2 [&>div]:!space-y-0 sscreen:[&>div]:!space-y-2">
                <Input
                    label={t("profile.deckName")}
                    inputName="label"
                    inputType="text"
                    data={myDeck}
                    attribute="label"
                    setAction={setMyDeck}
                    required={true}
                />
                <SelectInput
                    defaultOptionLabel={t("profile.selectArchetype")}
                    label={t("profile.selectedArchetype")}
                    required={true}
                    options={archetypes.map((archetype) => ({ id: archetype.id, label: archetype.name }))}
                    data={myDeck}
                    attribute="archetype_id"
                    setAction={handleArchetypeSelect}
                    disabled={(myDeck?.deck_cards?.length ?? 0) > 0}
                />
            </div>
            <div className="grid grid-cols-2 gap-1 sscreen:gap-4 mt-1 sscreen:mt-0 [&_label]:mt-1 sscreen:[&_label]:mt-2 [&_textarea]:mt-1 sscreen:[&_textarea]:mt-2">
                <TextArea
                    className="col-span-2"
                    label={t("profile.deckDescription")}
                    required={true}
                    value={myDeck?.comment ?? ""}
                    onChange={(e) => setMyDeck({ ...myDeck, comment: e.target.value })}
                />
            </div>

        </div>
    )
}

export default DeckData
