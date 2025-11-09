import React from 'react'
import Header from '../components/generic/header/Header'
import Jumbotron from '../components/generic/Jumbotron'
import PageContentBlock from '../components/generic/PageContentBlock'
import Footer from '../components/generic/footer/Footer'
import RevealOnScroll from '../components/generic/RevealOnScroll'

const RoadMap = () => {
    const quarters = [
        {
            period: "T3 - T4 2025",
            dates: "Juin - Decembre 2025",
            color: "from-gray-200 via-gray-100 to-purple-200 bg-gradient-to-b",
            titleColor: "text-gray-700",
            items: [
                "Développement des fonctionnalités principales (Fonctionnalités Dashboard Admin, Dashboard User, Système de Deck Builder, Système de Banlist)",
                "Tests et optimisations (Tests unitaires, Tests d'intégration, Tests de performance)",
                "Préparation du lancement (Lancement de la version 0, Collecte des retours utilisateurs, Améliorations basées sur les retours)",
                "Creation d'une communauté avec le lancement de la chaine Twitch, d'un canal Discord"
            ]
        },
        {
            period: "T1 2026",
            dates: "Janvier - Mars 2026",
            color: "bg-blue-100",
            titleColor: "text-blue-700",
            items: [
                "Développement des fonctionnalités Tournoi (Création de tournoi, Inscription à un tournoi, Résultats de tournoi)",
                "Développement des fonctionnalités Classement (Classement des joueurs, Classement des decks, Classement des tournois)",
            ]
        },
        {
            period: "T2 2026",
            dates: "Avril - Juin 2026",
            color: "bg-green-100",
            titleColor: "text-green-700",
            items: [
                "Développement des fonctionnalités Quizz (Quizz de connaissances sur l'univers Yu-Gi-Oh! - Manga/Anime, JdC, produits dérivés, etc.)",
                "Développement d'un système d'Utilisateur Premium (Creation de plus de decks, Personnalisation du profil, Accès à des tournois privés)"
            ]
        },
        {
            period: "T3 2026",
            dates: "Juillet - Septembre 2026",
            color: "bg-yellow-100",
            titleColor: "text-yellow-700",
            items: [
                "Refonte UX/UI du site web",
                "Lancement de la V1",
            ]
        },
        {
            period: "T4 2026",
            dates: "Octobre - Décembre 2026",
            color: "bg-purple-100",
            titleColor: "text-purple-700",
            items: [
                "En Attente",
            ]
        }
    ]

    return (
        <div className="flex flex-col">
            <div id="headBlock" className="imageBackground">
                <Header />
                <div className="relative p-3 lscreen:max-w-containerSize m-auto">
                    <Jumbotron
                        mainTitle="RoadMap"
                        subTitle="Evolution du projet Archetype Battle"
                    />
                </div>
            </div>

            <PageContentBlock>
                <div className="flex flex-col w-full justify-center max-w-containerSize m-auto">
                    <h1 className="text-2xl font-bold mb-8 text-center">RoadMap 2025-2026</h1>
                    
                    <div className="space-y-6">
                        {quarters.map((quarter, index) => (
                            <RevealOnScroll 
                                key={index} 
                                as="section" 
                                className={`rounded-xl p-6 ${quarter.color} shadow-sm`}
                            >
                                <div className="flex flex-col sscreen:flex-row sscreen:items-center sscreen:justify-between mb-4">
                                    <h2 className={`text-2xl tablet:text-3xl font-extrabold ${quarter.titleColor}`}>
                                        {quarter.period}
                                    </h2>
                                    <span className="text-gray-600 font-medium mt-2 sscreen:mt-0">
                                        {quarter.dates}
                                    </span>
                                </div>
                                
                                <ul className="space-y-2 mt-4">
                                    {quarter.items.map((item, itemIndex) => (
                                        <li key={itemIndex} className="flex items-start">
                                            <span className="text-gray-600 mr-2">•</span>
                                            <span className="text-gray-800">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </RevealOnScroll>
                        ))}
                    </div>
                </div>
            </PageContentBlock>
            <Footer />
        </div>
    )
}

export default RoadMap