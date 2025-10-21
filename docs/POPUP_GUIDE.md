# Composant PopUp - Guide d'utilisation

## 🚀 Installation

Le composant PopUp est déjà intégré dans votre application via le `PopUpProvider` dans `App.jsx`.

## 📖 Utilisation

### Import du hook

```javascript
import { usePopup } from "../../hooks/usePopup";

const MonComposant = () => {
  const { 
    showSuccess, 
    showError, 
    showWarning, 
    showInfo, 
    showConfirm, 
    showDeleteConfirm 
  } = usePopup();
  
  // Votre code...
};
```

## 🎯 Méthodes disponibles

### 1. **showSuccess(message, title?, options?)**
Affiche un popup de succès avec fermeture automatique.

```javascript
showSuccess("L'opération s'est déroulée avec succès !");
showSuccess("Succès", "Titre personnalisé");
```

### 2. **showError(message, title?, options?)**
Affiche un popup d'erreur avec fermeture automatique.

```javascript
showError("Une erreur est survenue lors de l'opération.");
```

### 3. **showWarning(message, title?, options?)**
Affiche un popup d'avertissement avec fermeture automatique.

```javascript
showWarning("Attention, cette action peut avoir des conséquences.");
```

### 4. **showInfo(message, title?, options?)**
Affiche un popup d'information avec fermeture automatique.

```javascript
showInfo("Voici une information importante pour vous.");
```

### 5. **showConfirm(message, title?, onConfirm, options?)**
Affiche un popup de confirmation avec boutons "Confirmer" et "Annuler".

```javascript
showConfirm(
  "Êtes-vous sûr de vouloir continuer ?",
  "Confirmation",
  () => {
    console.log("Utilisateur a confirmé");
    // Votre logique de confirmation
  }
);
```

### 6. **showDeleteConfirm(itemName, onConfirm, options?)**
Affiche un popup de confirmation de suppression spécialisé.

```javascript
showDeleteConfirm(
  "Mon Archétype",
  () => {
    console.log("Suppression confirmée");
    // Votre logique de suppression
  }
);
```

## ⚙️ Options avancées

Toutes les méthodes acceptent un objet `options` en dernier paramètre :

```javascript
showSuccess("Message", "Titre", {
  confirmText: "OK",
  cancelText: "Annuler",
  autoClose: true,
  autoCloseDelay: 5000,
  onConfirm: () => console.log("Callback personnalisé")
});
```

## 🎨 Types de popups

- **success** : Vert avec icône de validation
- **error** : Rouge avec icône de suppression
- **warning** : Jaune avec icône d'avertissement
- **info** : Bleu avec icône d'information

## 📱 Responsive

Le composant est entièrement responsive et s'adapte à tous les écrans.

## 🎭 Animations

- Apparition avec effet de scale et fade
- Fermeture automatique avec timer
- Backdrop avec blur
- Transitions fluides

## 🔧 Personnalisation

Le composant utilise Tailwind CSS et peut être facilement personnalisé en modifiant les classes dans `PopUp.jsx`.
