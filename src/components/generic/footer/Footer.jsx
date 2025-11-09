import React from "react";
import { Link } from "react-router-dom";
import {
  URL_FRONT_HOME,
  URL_FRONT_ABOUT,
  URL_FRONT_ARCHETYPES,
  URL_FRONT_BANLIST,
  URL_FRONT_TERMS_AND_CONDITIONS,
  URL_FRONT_LOGIN,
  URL_FRONT_REGISTER,
} from "../../../constant/urlsFront";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="p-4 bg-gray-200 text-gray-500 border-t border-gray-300">

      <p className="text-gray-500 pb-4">
        Les informations textuelles et graphiques présentées sur ce site concernant Yu-Gi-Oh! tout comme les images des cartes, les symboles d'attribut, de niveau/rang et de type ainsi que le texte des cartes sont la propriété de 4K Media Inc., une filiale de Konami Digital Entertainment, Inc. Ce site web n'est ni produit, ni approuvé, ni soutenu, ni affilié à 4K Media ou Konami Digital Entertainment.      </p>
      <div className="border-t border-gray-300 pt-4 flex flex-row justify-between items-center">
        <p className="text-gray-500">Le contenu restant - © {year} Archetype Battle</p>
        <p className="text-gray-500">
          Conçu avec passion pour les duellistes
        </p>
      </div>
    </footer>
  );
};

export default Footer;