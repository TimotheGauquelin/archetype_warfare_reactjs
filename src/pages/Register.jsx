/* eslint-disable no-unused-vars */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { URL_FRONT_LOGIN } from "../constant/urlsFront";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { InputPassword } from "../components/generic/form/InputPassword.jsx";
import Button from "../components/generic/Button";
import { Input } from "../components/generic/form/Input.jsx";
import { register } from "../services/auth.js";
import ErrorText from "../components/generic/ErrorText.jsx";
import { URL_FRONT_TERMS_AND_CONDITIONS } from "../constant/urlsFront";
import ErrorMultipleText from "../components/generic/ErrorMultipleText.jsx";

const Register = () => {
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    has_accepted_terms_and_conditions: false,
  });

  const [error, setError] = useState({
    message: null,
    multipleErrors: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = () => {
    setIsLoading(true);
    if (registerData.password !== registerData.passwordConfirmation) {
      setError({ message: "Les mots de passe ne correspondent pas", multipleErrors: null });
      setIsLoading(false);
      return;
    }

    register(registerData, navigate, toast, setError, setIsLoading);
  };

  return (
    <div className="bg-graybackground w-screen min-h-screen fixed left-0 top-0 flex justify-center items-center p-4">
      <div
        className={`bg-white w-full max-w-[400px] cardShadow rounded-xl flex flex-col p-4 sm:p-6 overflow-y-auto max-h-[95vh]`}
      >
        <div>
          <h3 className="text-xl sm:text-2xl text-center mb-4">Créer mon compte</h3>

          <div className="mb-4">
            <Input
              label="Nom d'utilisateur"
              required
              inputType="text"
              inputName="username"
              colSpanWidth="12"
              attribute="username"
              data={registerData}
              setAction={setRegisterData}
              disabled={isLoading}
            />
          </div>

          <div className="mb-4">
            <Input
              label="Email"
              required
              inputType="email"
              inputName="email"
              colSpanWidth="12"
              attribute="email"
              data={registerData}
              setAction={setRegisterData}
              disabled={isLoading}
            />
          </div>

          <div className="mb-4">
            <InputPassword
              label="Mot de passe"
              required
              colSpanWidth="12"
              attribute="password"
              data={registerData}
              setAction={setRegisterData}
              disabled={isLoading}
            />
          </div>

          <div className="mb-4">
            <InputPassword
              label="Confirmation du mot de passe"
              required
              colSpanWidth="12"
              attribute="passwordConfirmation"
              data={registerData}
              setAction={setRegisterData}
              disabled={isLoading}
            />
          </div>

          <div className="my-4 flex items-start">
            <input
              type="checkbox"
              id="acceptTerms"
              checked={registerData.has_accepted_terms_and_conditions}
              onChange={(e) => setRegisterData({ ...registerData, has_accepted_terms_and_conditions: e.target.checked })}
              className="mt-1 mr-2"
              disabled={isLoading}
            />
            <label htmlFor="acceptTerms" className="text-sm">
              J'accepte les{" "}
              <button
                type="button"
                onClick={() => navigate(URL_FRONT_TERMS_AND_CONDITIONS)}
                className="text-blue-600 hover:underline"
                disabled={isLoading}
              >
                termes et conditions
              </button>{" "}
              du site
            </label>
          </div>
        </div>

        {error.multipleErrors && error.message &&
          <ErrorMultipleText multipleErrors={error.message} />
        }
        {!error.multipleErrors && error.message &&
          <ErrorText errorText={error.message} />
        }

        <Button
          buttonText="Créer mon compte"
          className="bg-black text-white w-full p-2 mb-2 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
          action={handleRegister}
          disabled={isLoading}
          loadingText="Inscription en cours..."
        />

        <div className="text-center">
          <span className="text-sm text-gray-600">Déjà un compte ? </span>
          <Button
            buttonText="Se connecter"
            className="text-sm text-blue-900 cursor-pointer hover:underline"
            action={() => navigate(URL_FRONT_LOGIN)}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
