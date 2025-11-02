import React, { useEffect, useState } from 'react'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { searchCards } from '../../../../services/card';

const AdminBanlistAddCard = ({ banlist, setBanlist }) => {

    const [cards, setCards] = useState([]);

    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 0,
        currentPage: 1,
        pageSize: 30,
    });

    const [filters, setFilters] = useState({
        name: "",
        page: 1,
        size: 30,
    });

    const increasePage = () => {
        if (pagination.currentPage < pagination.totalPages) {
            setFilters(prev => ({
                ...prev,
                page: prev.page + 1
            }));
        }
    };

    const decreasePage = () => {
        if (pagination.currentPage > 1) {
            setFilters(prev => ({
                ...prev,
                page: prev.page - 1
            }));
        }
    };

    const addCardToBanlist = (card) => {
        const isCardAlreadyInBanlist = banlist.banlist_archetype_cards.some(
            (banlistCard) => banlistCard.card?.id === card.id
        );

        if (!isCardAlreadyInBanlist) {
            // const newCard = {
            //     banlist: {
            //         id: 1,
            //     },
            //     card: {
            //         id: card.id,
            //         name: card.name,
            //         img_url: card.img_url
            //     },
            //     card_status: {
            //         id: 4,
            //     },
            //     card_status_id: 4,
            //     explanation_text: "Carte limitée dans cette banlist"
            // };

            const newCard = {
                card_id: card.id,
                archetype_id: null,
                card_status_id: 1,
                explanation_text: "Too versatile",
                card: card,
                card_status: {
                    id: 1,
                    label: "Forbidden"
                }
            }

            setBanlist((prevState) => ({
                ...prevState,
                banlist_archetype_cards: [...prevState.banlist_archetype_cards, newCard],
            }));
        }
    }


    useEffect(() => {
        searchCards(setCards, setPagination, filters.size, filters.page, filters.name);
    }, [filters]);

    return (
        <div className="col-span-4 grid grid-cols-12 mt-2">
            <div className="bg-gray-400 col-span-12 ml-1 p-3 rounded">
                <div className="grid grid-cols-12 gap-2">
                    <input
                        className={`w-full p-1 col-span-8`}
                        value={filters.name}
                        type="text"
                        placeholder="Quelle carte recherchez-vous ?"
                        onChange={(e) => {
                            setFilters(prev => ({
                                ...prev,
                                name: e.target.value,
                                page: 1
                            }));
                        }}
                    />
                </div>
                <div
                    className="overflow-y-auto bg-white grid grid-cols-12"
                    style={{ maxHeight: "400px" }}
                >
                    {cards?.map((card, index) => {
                        const isCardAlreadyInBanlist = banlist.banlist_archetype_cards.some(
                            (banlistCard) => banlistCard.card?.id === card.id
                        );

                        return (
                            <div className="col-span-3 p-1 relative" key={index}>
                                <img
                                    className={`hover:saturate-150 cursor-pointer ${isCardAlreadyInBanlist ? 'opacity-50' : ''
                                        }`}
                                    src={`${card?.img_url}`}
                                    alt=""
                                    onClick={() => !isCardAlreadyInBanlist && addCardToBanlist(card)}
                                />
                                {isCardAlreadyInBanlist && (
                                    <p
                                        style={{ fontSize: "8px", padding: "2px" }}
                                        className="absolute top-20 left-0 text-center w-full text-sm bg-yellow-500 text-white rounded"
                                    >
                                        Déjà ajoutée
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="flex justify-around items-center">
                    <FaAngleLeft
                        className={`h-8 cursor-pointer ${pagination.currentPage <= 1 && "invisible"}`}
                        onClick={() => decreasePage()}
                    />
                    <p>{pagination.currentPage}</p>
                    <FaAngleRight
                        className={`h-8 cursor-pointer ${pagination.currentPage >= pagination.totalPages && "invisible"
                            }`}
                        onClick={() => {
                            increasePage();
                        }}
                    />
                </div>
            </div>
        </div>
    )
}
export default AdminBanlistAddCard