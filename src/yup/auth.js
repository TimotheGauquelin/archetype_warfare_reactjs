import { genericYup } from "../constant/genericYup";
import * as yup from "yup";

const registerAccountSchema = yup.object().shape({
  username: genericYup.username,
  password: genericYup.password,
  passwordConfirmation: genericYup.passwordConfirmation,
  email: genericYup.email,
});

const loginAccountSchema = yup.object().shape({
  username: yup.string().required("Erreur: Champs requis").trim(),
  password: yup.string().required("Erreur: Champs requis").trim(),
});

// eslint-disable-next-line import/no-anonymous-default-export
export default { registerAccountSchema, loginAccountSchema };
