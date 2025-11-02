import React from 'react'

const DeckData = ({ myDeck, setMyDeck, archetypes }) => {

console.log("myDeck", myDeck);

    return (
        <div className="p-4 bg-gray-300 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1 flex flex-col mb-2">
                    <label htmlFor="">Nom du deck: </label>
                    <input
                        className="mt-2 p-2"
                        type="text"
                        name="label"
                        value={myDeck?.label}
                        onChange={(e) => setMyDeck({ ...myDeck, label: e.target.value })}
                    />
                </div>
                <div className="col-span-1 flex flex-col mb-2">
                    <label htmlFor="">Archetype selectionné:</label>
                    <select
                        className="mt-2 p-2"
                        value={myDeck?.archetype_id || ""}
                        disabled={myDeck?.deck_cards?.length > 0}
                        onChange={(e) => setMyDeck({ ...myDeck, archetype_id: e.target.value })}
                    >
                        <option value="" disabled>Sélectionnez un archétype</option>
                        {archetypes && archetypes.map((archetype) => (
                            <option key={archetype.id} value={archetype.id}>{archetype.name}</option>
                        ))}
                    </select>

                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 flex flex-col mb-2">
                    <label htmlFor="">Description du deck: </label>
                    <textarea
                        className="mt-2 p-2"
                        name="description"
                        rows={2}
                        value={myDeck?.comment}
                        onChange={(e) => setMyDeck({ ...myDeck, comment: e.target.value })}
                    />
                </div>
            </div>

        </div>
    )
}

export default DeckData