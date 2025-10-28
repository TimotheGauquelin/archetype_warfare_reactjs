/* eslint-disable no-unused-vars */

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  URL_FRONT_PASSWORD_LOST,
  URL_FRONT_REGISTER,
} from "../constant/urlsFront";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { InputPassword } from "../components/generic/form/InputPassword.jsx";
import Button from "../components/generic/Button";
import { Input } from "../components/generic/form/Input.jsx";
import { logIn } from "../services/auth.js";
import ErrorText from "../components/generic/ErrorText.jsx";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [log, setLog] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setError("");
    
    // Validation des champs
    if (!log.email || !log.email.includes("@")) {
      setError("Veuillez saisir une adresse email valide");
      return;
    }
    
    if (!log.password) {
      setError("Veuillez saisir votre mot de passe");
      return;
    }

    setIsLoading(true);
    logIn(log, dispatch, navigate, setError, setIsLoading);
  };

  return (
    <div className="bg-graybackground w-screen h-screen fixed left-0 top-0 flex justify-center items-center">
      <div
        className={`bg-white w-[400px] max-w-[400px] cardShadow rounded-xl flex flex-col p-6`}
      >
        <div>
          <h3 className="text-2xl text-center mb-4 font-semibold">
            Connectez-vous
          </h3>

          <div className="mb-4">
            <Input
              label="Email"
              required
              inputType="email"
              inputName="email"
              cmt-4 nWidth="12"
              attribute="email"
              setAction={setLog}
              disabled={isLoading}
            />
          </div>

          <div className="mb-4">
            <InputPassword
              label="Mot de passe"
              required
              colSpanWidth="12"
              attribute="password"
              setAction={setLog}
              disabled={isLoading}
            />
          </div>

          {error && <ErrorText errorText={error} />}

          <Button
            buttonText="Se connecter"
            className="bg-black text-white w-full mt-2 p-3 rounded font-medium transition-all duration-200"
            disabled={isLoading}
            loadingText="Connexion en cours..."
            action={handleLogin}
          />
        </div>

        <div className="flex-grow h-[1px] m-2 bg-gray-300"></div>

        <div className="text-center space-y-2">
          <Button
            buttonText="Mot de passe oublié ?"
            className="text-sm text-blue-900 cursor-pointer hover:underline transition-all duration-200"
            action={() => navigate(URL_FRONT_PASSWORD_LOST)}
          />
          <div>
            {/* <p className="text-sm text-gray-600">
              Les inscriptions sont fermées pour le moment.
            </p> */}
            <Link to={URL_FRONT_REGISTER} className="text-sm text-blue-900 cursor-pointer hover:underline transition-all duration-200">
              Créer un compte
            </Link>
          </div>
        </div>

        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </div>
  );
};

export default Login;
