import React from "react";
import PageContentBlock from "../components/generic/PageContentBlock";
import Header from "../components/generic/header/Header";
import Jumbotron from "../components/generic/Jumbotron";
import { Link } from "react-router-dom";
import { URL_FRONT_ARCHETYPES } from "../constant/urlsFront";
import RevealOnScroll from "../components/generic/RevealOnScroll";
import Footer from "../components/generic/footer/Footer";

const Concept = () => {
  const archetypeSample = [
    { name: "Magicien Sombre", imgUrl: "darkmagician_sample" },
    { name: "Poussière d'Etoile", imgUrl: "stardust_sample" },
    { name: "Inzektor", imgUrl: "inzektor_sample" },
  ];

  const rules = [
    { emoji: "🎴", title: "Un seul archétype", desc: "Affirmez votre identité de jeu et perfectionnez votre synergie" },
    { emoji: "🚫", title: "Banlist dédiée", desc: "Conçue pour couper court aux abus et aux coûts astronomiques, la banlist Archetype Battle bannit les cartes trop puissantes ou trop chères" },
    { emoji: "🔥", title: "Limites d’invocations", desc: "Un tempo repensé pour des interactions plus fluides et une lecture plus calme du jeu. Le premier tour est limité à 5 invocations, puis chaque tour suivant est incréménté de 1 invocation" },
  ]

  return (
    <div className="flex flex-col">
      <div id="headBlock" className="imageBackground">
        <Header />
        <div className="relative p-3 lscreen:max-w-containerSize m-auto">
          <Jumbotron
            mainTitle="Rejoignez le champ de bataille des archétypes"
            subTitle="Une expérience Yu-Gi-Oh! réinventée : plus d'équilibre, plus de stratégie, plus de fun."
          />
        </div>
      </div>

      <PageContentBlock>
        <div className="space-y-10">
          <RevealOnScroll as="section" className="rounded-xl p-6 bg-blue-100 shadow-sm">
            <h2 className="text-center text-2xl tablet:text-3xl font-extrabold text-indigo-700">
              Un jeu légendaire devenu un phénomène mondial
            </h2>
            <p className="mt-4 text-gray-800 leading-relaxed text-justify">
              Depuis plus de <span className="font-semibold text-indigo-600">25 ans</span>, Yu-Gi-Oh! fait vibrer les duellistes
              du monde entier. Né d’un manga culte, le TCG s’est imposé comme un <span className="font-semibold">monument stratégique</span>,
              où chaque duel raconte une histoire. Des mécaniques iconiques ont façonné son identité — <span className="font-semibold">Fusion</span>, <span className="font-semibold">Synchro</span>, <span className="font-semibold">Xyz</span>, <span className="font-semibold">Pendule</span>, <span className="font-semibold">Lien</span> —
              enrichissant sans cesse le gameplay. Chaque deck incarne un <span className="font-semibold">archétype</span> : une famille de cartes, un style, une vision de la victoire.
            </p>

            <div className="grid grid-cols-12 gap-4 mt-6">
              {archetypeSample.map((sample, index) => (
                <div key={index} className="col-span-12 sscreen:col-span-4">
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="overflow-hidden">
                      <img
                        src={`${process.env.PUBLIC_URL}/assets/archetypeSample/${sample.imgUrl}.jpg`}
                        alt={sample.name}
                        className="w-full transform hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <p className="text-center font-semibold p-3 text-gray-800">
                      Archétype <span className="text-indigo-600">{sample.name}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </RevealOnScroll>
          <RevealOnScroll as="section" className="rounded-xl p-6 bg-red-100 shadow-sm">
            <h2 className="text-center text-2xl tablet:text-3xl font-extrabold text-red-600">
              Une meta devenue déséquilibrée
            </h2>
            <p className="mt-4 text-gray-800 leading-relaxed text-justify">
              Au fil du temps, la meta compétitive s’est transformée en un terrain inégal. Des cartes trop puissantes écourtent les duels,
              des combos étouffent l’interaction, et les decks “meta” se vendent à prix d’or. Résultat : un jeu parfois <span className="font-semibold">rapide</span>,
              <span className="font-semibold">brutal</span> et <span className="font-semibold">coûteux</span>, loin de l’esprit d’origine.
            </p>
            <div className="mt-4 text-center">
              <span className="inline-block px-4 py-2 rounded-full bg-red-200 shadow-sm text-red-700 font-bold">
                Problème: Yu-Gi-Oh! est un jeu injuste et qui coute cher, où l’équité et le plaisir de jeu en souffrent
              </span>
            </div>
          </RevealOnScroll>
          <RevealOnScroll as="section" className="rounded-xl p-6 bg-green-100 shadow-sm">
            <h2 className="text-center text-2xl tablet:text-3xl font-extrabold text-emerald-700">
              Archetype Battle : un format alternatif, une nouvelle vision
            </h2>
            <p className="mt-4 text-gray-800 leading-relaxed text-justify">
              Archetype Battle remet la stratégie au centre. Plus besoin de dépenser des fortunes : seul compte le talent, la créativité et la maîtrise de votre archétype.
              Le format ralentit le rythme, favorise les choix tactiques et redonne à chaque duel son intensité.
            </p>

            <div className="flex flex-col gap-4 mt-6">
              {rules.map((item, idx) => (
                <div
                  key={idx}
                  className="col-span-12 sscreen:col-span-6 lscreen:col-span-4 cursor-pointer"
                >
                  <div className="h-full bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                    <div className="text-2xl">{item.emoji}</div>
                    <p className="font-bold text-gray-900 mt-2">{item.title}</p>
                    <p className="text-gray-700">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-green-200 shadow-sm text-green-700 font-bold">
                Timing, ressources, lecture : le cerveau avant le portefeuille
              </span>
            </div>
          </RevealOnScroll>
          <RevealOnScroll as="section" className="rounded-xl p-6 bg-blue-100 shadow-sm">
            <div className="grid grid-cols-12 gap-6 items-center">
              <div className="col-span-12 lscreen:col-span-8">
                <h3 className="text-2xl font-bold text-gray-900">Prêts à rejoindre l’arène ?</h3>
                <p className="text-gray-800 mt-2">
                  Explorez les archétypes, choisissez votre camp et imposez votre style. Ici, la victoire se gagne
                  par la maîtrise et la réflexion.
                </p>
              </div>
              <div className="col-span-12 lscreen:col-span-4 flex lscreen:justify-end">
                <Link
                  to={URL_FRONT_ARCHETYPES}
                  className="px-5 py-3 bg-black text-white rounded-md font-semibold hover:opacity-90 transition-opacity duration-150"
                >
                  Explorer les archétypes
                </Link>
              </div>
            </div>
          </RevealOnScroll>

        </div>
      </PageContentBlock>

      <Footer />
    </div>
  );
};

export default Concept;
