import React from "react";
import { FaDiscord, FaTwitch, FaYoutube } from "react-icons/fa";

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
        <div className="flex flex-row justify-center items-center gap-1">
          <div className="bg-purple-700 p-1">
            <FaTwitch className='w-4 h-4' color="white" />
          </div>
          <div className="bg-blue-600 p-1">
            <FaDiscord className='w-4 h-4' color="white" />
          </div>
          <div className="bg-red-700 p-1">
            <FaYoutube className='w-4 h-4' color="white" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;