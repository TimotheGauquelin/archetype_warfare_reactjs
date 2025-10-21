import React from "react";
import { usePopup } from "../../hooks/usePopup";

// Exemple d'utilisation du PopUp dans n'importe quel composant
const ExampleUsage = () => {
  const { 
    showSuccess, 
    showError, 
    showWarning, 
    showInfo, 
    showConfirm, 
    showDeleteConfirm 
  } = usePopup();

  const handleSuccess = () => {
    showSuccess("L'opération s'est déroulée avec succès !");
  };

  const handleError = () => {
    showError("Une erreur est survenue lors de l'opération.");
  };

  const handleWarning = () => {
    showWarning("Attention, cette action peut avoir des conséquences.");
  };

  const handleInfo = () => {
    showInfo("Voici une information importante pour vous.");
  };

  const handleConfirm = () => {
    showConfirm(
      "Êtes-vous sûr de vouloir continuer ?",
      "Confirmation",
      () => {
        console.log("Utilisateur a confirmé");
        showSuccess("Action confirmée !");
      }
    );
  };

  const handleDelete = () => {
    showDeleteConfirm(
      "Mon Archétype",
      () => {
        console.log("Suppression confirmée");
        showSuccess("Archétype supprimé avec succès !");
      }
    );
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Exemples d'utilisation du PopUp</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handleSuccess}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Succès
        </button>
        
        <button
          onClick={handleError}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Erreur
        </button>
        
        <button
          onClick={handleWarning}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Avertissement
        </button>
        
        <button
          onClick={handleInfo}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Information
        </button>
        
        <button
          onClick={handleConfirm}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Confirmation
        </button>
        
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
};

export default ExampleUsage;
