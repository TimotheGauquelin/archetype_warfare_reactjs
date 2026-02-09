import { DISCORD_URL, TWITCH_URL } from "@/utils/const/extraLink";
import { currentYear } from "@/utils/date/currentYear";
import React from "react";
import { FaDiscord, FaTwitch, FaYoutube } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="p-4 bg-gray-200 text-gray-500 border-t border-gray-300">
      <div className="flex flex-col border-b w-full lscreen:m-auto lscreen:max-w-containerSize">
        <p className="text-gray-500 pb-4">
          Les informations textuelles et graphiques présentées sur ce site concernant Yu-Gi-Oh! tout comme les images des cartes, les symboles d'attribut, de niveau/rang et de type ainsi que le texte des cartes sont la propriété de 4K Media Inc., une filiale de Konami Digital Entertainment, Inc. Ce site web n'est ni produit, ni approuvé, ni soutenu, ni affilié à 4K Media ou Konami Digital Entertainment.
        </p>
        <div className="border-t border-gray-300 pt-4 flex flex-row justify-between items-center">
          <p className="text-gray-500">Le contenu restant - © 2025 -{currentYear} Archetype Battle</p>
          <p className="text-gray-500">
            Conçu avec passion pour les duellistes
          </p>
          <div className="flex flex-row justify-center items-center gap-1">
            <a href={TWITCH_URL} target="_blank" rel="noopener noreferrer" className="bg-purple-700 p-1 cursor-pointer" aria-label="Twitch">
              <FaTwitch className='w-4 h-4' color="white" />
            </a>
            <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="bg-blue-600 p-1 cursor-pointer" aria-label="Discord">
              <FaDiscord className='w-4 h-4' color="white" />
            </a>
            <div className="bg-red-700 p-1">
              <FaYoutube className='w-4 h-4' color="white" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;