import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/generic/Button";

const TermsAndConditions = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-graybackground min-h-screen py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Termes et Conditions
          </h1>
          <Button
            buttonText="Retour"
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            action={() => navigate(-1)}
          />
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              1. Acceptation des termes
            </h2>
            <p className="text-gray-700 mb-4">
              En accédant et en utilisant Archetype Warfare, vous acceptez d'être lié par ces termes et conditions d'utilisation. Si vous n'acceptez pas ces termes, veuillez ne pas utiliser notre service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              2. Description du service
            </h2>
            <p className="text-gray-700 mb-4">
              Archetype Warfare est une plateforme dédiée aux joueurs de Yu-Gi-Oh! qui permet de découvrir, analyser et partager des informations sur les archétypes de cartes. Notre service inclut des bases de données de cartes, des listes de ban, et des outils de gestion de deck.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              3. Compte utilisateur
            </h2>
            <div className="text-gray-700 mb-4">
              <p className="mb-2">Pour utiliser certaines fonctionnalités, vous devez créer un compte. Vous êtes responsable de :</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Maintenir la confidentialité de vos informations de connexion</li>
                <li>Toutes les activités qui se produisent sous votre compte</li>
                <li>Nous informer immédiatement de toute utilisation non autorisée</li>
                <li>Fournir des informations exactes et à jour</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              4. Utilisation acceptable
            </h2>
            <div className="text-gray-700 mb-4">
              <p className="mb-2">Vous acceptez de ne pas :</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Utiliser le service à des fins illégales ou non autorisées</li>
                <li>Violer les droits de propriété intellectuelle</li>
                <li>Publier du contenu offensant, abusif ou inapproprié</li>
                <li>Tenter de perturber ou de compromettre la sécurité du service</li>
                <li>Utiliser des bots ou des scripts automatisés sans autorisation</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              5. Propriété intellectuelle
            </h2>
            <p className="text-gray-700 mb-4">
              Le contenu d'Archetype Warfare, y compris mais sans s'y limiter, les textes, graphiques, logos, et logiciels, est protégé par les droits d'auteur et autres lois sur la propriété intellectuelle. Yu-Gi-Oh! et ses éléments associés sont des marques déposées de Konami Digital Entertainment.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              6. Confidentialité
            </h2>
            <p className="text-gray-700 mb-4">
              Votre vie privée est importante pour nous. Veuillez consulter notre politique de confidentialité pour comprendre comment nous collectons, utilisons et protégeons vos informations personnelles.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              7. Limitation de responsabilité
            </h2>
            <p className="text-gray-700 mb-4">
              Archetype Warfare est fourni "tel quel" sans garantie d'aucune sorte. Nous ne serons pas responsables des dommages directs, indirects, accessoires ou consécutifs résultant de l'utilisation de notre service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              8. Modifications des termes
            </h2>
            <p className="text-gray-700 mb-4">
              Nous nous réservons le droit de modifier ces termes à tout moment. Les modifications prendront effet immédiatement après leur publication sur le site. Il est de votre responsabilité de consulter régulièrement ces termes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              9. Contact
            </h2>
            <p className="text-gray-700 mb-4">
              Si vous avez des questions concernant ces termes et conditions, veuillez nous contacter via notre page de contact ou par email.
            </p>
          </section>

          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions; 