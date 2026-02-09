import * as yup from "yup";

const genericYup = {
  username: yup
    .string()
    .required("Erreur: Champs requis")
    .min(5, "Erreur: 5 caractères minimun")
    .max(40, "Erreur: 40 caractères maximum")
    .trim(),
  password: yup
    .string()
    .required("Erreur: Champs requis")
    .min(8, "Erreur: Doit contenir 8 caractères ou plus")
    .matches(/[a-z]+/, "Erreur: Doit contenir au moins une minuscule")
    .matches(/[A-Z]+/, "Erreur: Doit contenir au moins une majuscule")
    .matches(
      /[@$!%*#?&+-]+/,
      "Erreur: Doit contenir au moins un caractère spécial"
    )
    .matches(/\d+/, "Erreur: Doit contenir au moins un chiffre")
    .trim(),
  passwordConfirmation: yup
    .string()
    .required("Erreur: Champs requis")
    .oneOf(
      [yup.ref("password"), null],
      "Erreur: Les mots de passe doivent être identiques"
    )
    .trim(),
  email: yup
    .string()
    .required("Erreur: Champs requis")
    .email("Erreur: Ceci n'est pas un email")
    .trim(),
};

export { genericYup };
