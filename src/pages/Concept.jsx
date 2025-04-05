import React from "react";
import PageContentBlock from "../components/generic/PageContentBlock";
import Header from "../components/generic/header/Header";
import Jumbotron from "../components/generic/Jumbotron";

const Concept = () => {
  const archetypeSample = [
    {
      name: "Magicien Sombre",
      imgUrl: "darkmagician_sample",
    },
    {
      name: "Poussière d'Etoile",
      imgUrl: "stardust_sample",
    },
    {
      name: "Inzektor",
      imgUrl: "inzektor_sample",
    },
  ];

  return (
    <div className="flex flex-col">
      <div id="headBlock" className="imageBackground">
        <Header />
        <div className="relative p-3 lscreen:max-w-containerSize m-auto">
          <Jumbotron
            mainTitle="Vous vous posez des questions sur ce format ?"
            subTitle="Venez lire les origines d'Archetype Warfare !"
          />
        </div>
      </div>
      <PageContentBlock>
        <div>
          <h2 className="text-center text-2xl font-bold underline">
            Constat et problématique autour du jeu officiel :
          </h2>
          <div className="">
            <p className="mt-5">
              Le Jeu de Cartes Yu-Gi-Oh! a, aujourd'hui, plus de 25ans. Pendant
              toutes ces années, le jeu n'a cessé d'évoluer et de gagner en
              rapidité. Les joueurs peuvent jouer des decks avec des méchaniques
              diverses et variées ce qui rend le jeu interessant et
              divertissant. Ce genre de decks est appelé Archetype. De nos
              jours, il existe plus de 100 archetypes. Mais chaque archetype ne
              possède pas la même puissance. Certains sont avantagés plus que
              d'autres car ils partagent des points communs, des similitudes
              avec d'autres cartes, d'autres archétypes augmentant leur
              puissance faisant d'eux des decks indestructible.
            </p>
            <div className="grid grid-cols-12 gap-4 mt-5 bg-gray-100 p-4 rounded-lg">
              {archetypeSample.map((sample, index) => {
                return (
                  <div key={index} className="col-span-4">
                    <div>
                      <img
                        src={`${process.env.PUBLIC_URL}/assets/archetypeSample/${sample.imgUrl}.jpg`}
                        alt={sample.name}
                      />
                      <p className="text-center">
                        Archetype <b> {sample.name}</b>
                      </p>
                    </div>
                  </div>
                );
              })}{" "}
            </div>
            <div className="mt-5">
              <p>
                En plus de cela, le JdC compétitif de Yu-Gi-Oh! possède d'autres
                problèmes majeurs que le format Archetype Warfare va tenter de
                réguler :{" "}
              </p>
              <ol className="ml-5">
                <li>
                  - La{" "}
                  <span className="font-bold">
                    surpuissance de certaines cartes
                  </span>{" "}
                  qui a elle tout seule empêche de jouer ou de répliquer. Dans
                  un jeu qui mise sur l'interaction, il est inconcevable d'avoir
                  de telles cartes.
                </li>
                <li className="mt-2">
                  - Le{" "}
                  <span className="font-bold">
                    prix des cartes qui atteignent des valeurs astronomiques
                  </span>
                  , empechant toute personne de les jouer. Ici, le but est de
                  sanctionner les cartes polyvalentes trop cheres.
                </li>
              </ol>
            </div>
            <div className="font-bold text-md text-red-500 text-center mt-5">
              En résumé, Yu-Gi-Oh! est un jeu injuste et qui coute cher
            </div>
          </div>
          <div className="mt-5">
            <h2 className="text-center text-2xl font-bold underline">
              Qu'est-ce que le format Archetype Warfare ?
            </h2>
            <div className="mt-5">
              <p>
                Archetype Warfare est un mode de jeu pour permettre au joueur
                peu fortuné de pouvoir jouer au même niveau que d'autres sans
                pour autant dépenser beaucoup d'argent. De plus, ce nouveau
                système va supprimer les cartes trop fortes permettant de gagner
                en un seul tour. Le but est de gagner grâce à ses connaissances,
                son potentiel à économiser les ressources et gérer les
                situations complexes.
              </p>
              <p className="mt-5 font-bold">
                Que faut-il pour jouer à Archetype Warfare :
              </p>
              <ul className="mt-2 ml-5">
                <li>
                  - Un deck d'Archetype Battle requiert un et un seul archétype
                  avec lequel jouer. Pour voir quel archetype existe dans ce
                  format, dirigez-vous{" "}
                  <a
                    className="underline"
                    href="http://localhost:3000/archetypes"
                  >
                    ici
                  </a>{" "}
                  . Mais il peut aussi jouer des cartes ne faisant parti d'aucun
                  archetype, des cartes génériques. Mais attention : Un deck
                  doit comporter une limite de 40 et 60 cartes.
                </li>
                <li className="mt-2">
                  - Un deck d'Archetype Battle est soumis à une liste de cartes
                  interdites. DeS cartes sont jouable en un seul exemplaire,
                  certaines en deux et d'autres en trois. Pour voir quelles
                  cartes sont interdites en ce moment, dirigez-vous{" "}
                  <a
                    className="underline"
                    href="http://localhost:3000/banlists"
                  >
                    ici
                  </a>{" "}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </PageContentBlock>
    </div>
  );
};

export default Concept;
