import React from 'react'
import { useTranslation } from 'react-i18next';
import type { Deck, Archetype } from '../../../../types';
import { Input } from '@/components/generic/form/input/Input';
import TextArea from '@/components/generic/form/textArea/TextArea';
import SelectInput from '@/components/generic/form/SelectInput';

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
                    card_img_url: selectedArchetype?.card_img_url ?? next.archetype.card_img_url,
                    is_active: selectedArchetype?.is_active ?? next.archetype.is_active,
                },
            };
        });
    };

    return (
        <div data-testid="deck-data" className="p-4 bg-gray-300 rounded-lg">
            <span className="font-bold text-lg mb-2">
                {t("profile.deckInfo")}
            </span>
            {
                myDeck.archetype.is_active === false && (
                    <p className="p-2 bg-yellow-100 text-yellow-800 rounded-md text-sm font-semibold">
                        {t("profile.archetypeInactiveWarning")}
                    </p>
                )
            }
            <div className="grid grid-cols-2 gap-4">
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
                    className="mt-2"
                    label={t("profile.selectedArchetype")}
                    required={true}
                    options={archetypes.map((archetype) => ({ id: archetype.id, label: archetype.name }))}
                    data={myDeck}
                    attribute="archetype_id"
                    setAction={handleArchetypeSelect}
                    disabled={(myDeck?.deck_cards?.length ?? 0) > 0}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
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
