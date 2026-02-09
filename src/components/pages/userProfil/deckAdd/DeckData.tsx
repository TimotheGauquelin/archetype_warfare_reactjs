import React from 'react'
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
    return (
        <div data-testid="deck-data" className="p-4 bg-gray-300 rounded-lg">
            <span className="font-bold text-lg mb-2">
                Informations du deck
            </span>
            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Nom du deck"
                    inputName="label"
                    inputType="text"
                    data={myDeck}
                    attribute="label"
                    setAction={setMyDeck}
                    required={true}
                />
                <SelectInput
                    defaultOptionLabel="Sélectionnez un archétype"
                    className="mt-2"
                    label="Archetype selectionné"
                    required={true}
                    options={archetypes.map((archetype) => ({ id: archetype.id, label: archetype.name }))}
                    data={myDeck}
                    attribute="archetype_id"
                    setAction={setMyDeck}
                    disabled={(myDeck?.deck_cards?.length ?? 0) > 0}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <TextArea
                    className="col-span-2"
                    label="Description du deck"
                    required={true}
                    value={myDeck?.comment ?? ""}
                    onChange={(e) => setMyDeck({ ...myDeck, comment: e.target.value })}
                />
            </div>

        </div>
    )
}

export default DeckData