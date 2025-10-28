/* eslint-disable no-unused-vars */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { URL_FRONT_LOGIN } from "../constant/urlsFront";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { InputPassword } from "../components/generic/form/InputPassword.jsx";
import Button from "../components/generic/Button";
import { Input } from "../components/generic/form/Input.jsx";
import { register } from "../services/auth.js";
import ErrorText from "../components/generic/ErrorText.jsx";
import { URL_FRONT_TERMS_AND_CONDITIONS } from "../constant/urlsFront";

const Register = () => {
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = () => {
    if (registerData.password !== registerData.passwordConfirmation) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    register(registerData, navigate, setError);
  };

  return (
    <div className="bg-graybackground w-screen h-screen fixed left-0 top-0 flex justify-center items-center">
      <div
        className={`bg-white w-[400px] max-w-[400px] cardShadow rounded-xl flex flex-col p-6`}
      >
        <div>
          <h3 className="text-2xl text-center mb-4">Créer mon compte</h3>

          <Input
            label="Nom d'utilisateur"
            required
            inputType="text"
            inputName="username"
            colSpanWidth="12"
            attribute="username"
            setAction={setRegisterData}
          />

          <Input
            label="Email"
            required
            inputType="email"
            inputName="email"
            colSpanWidth="12"
            attribute="email"
            setAction={setRegisterData}
          />

          <InputPassword
            label="Mot de passe"
            required
            colSpanWidth="12"
            attribute="password"
            setAction={setRegisterData}
          />

          <InputPassword
            label="Confirmation du mot de passe"
            required
            colSpanWidth="12"
            attribute="passwordConfirmation"
            setAction={setRegisterData}
          />

          <div className="my-4 flex items-start">
            <input
              type="checkbox"
              id="acceptTerms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-1 mr-2"
            />
            <label htmlFor="acceptTerms" className="text-sm">
              J'accepte les{" "}
              <button
                type="button"
                onClick={() => navigate(URL_FRONT_TERMS_AND_CONDITIONS)}
                className="text-blue-600 hover:underline"
              >
                termes et conditions
              </button>{" "}
              du site
            </label>
          </div>
        </div>

        {error && <ErrorText errorText={error} />}

        <Button
          buttonText="Créer mon compte"
          className="bg-black text-white w-full p-2 mb-2 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
          action={handleRegister}
        />

        <div className="text-center">
          <span className="text-sm text-gray-600">Déjà un compte ? </span>
          <Button
            buttonText="Se connecter"
            className="text-sm text-blue-900 cursor-pointer hover:underline"
            action={() => navigate(URL_FRONT_LOGIN)}
          />
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Register;
