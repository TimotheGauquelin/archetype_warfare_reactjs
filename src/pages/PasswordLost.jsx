import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../components/generic/Button";
import { Input } from "../components/generic/form/Input";
import { URL_FRONT_LOGIN } from "../constant/urlsFront";
import { requestNewPassword } from "../services/auth";
import Error from "../components/generic/Error";

const PasswordLost = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [requestIsDone, setRequestIsDone] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="bg-graybackground w-screen h-screen fixed left-0 top-0 flex justify-center items-center">
      <div
        className={`bg-white w-[400px] max-w-[400px] cardShadow rounded-xl flex flex-col p-6`}
      >
        <h3 className="text-2xl text-center mb-4">
          Reinitialiser le mot de passe
        </h3>
        <>
          {requestIsDone ? (
            <>
              <p>
                Un e-mail vient de vous être envoyé. Il contient un lien valable
                24 heures pour réinitialiser votre mot de passe. Pensez à
                vérifier qu’il ne se trouve pas dans vos courriers indésirables.
              </p>
              <Button
                className="text-sm text-blue-900 mt-2 cursor-pointer hover:underline"
                buttonText="Revenir à la page de connexion"
                action={() => {
                  navigate(URL_FRONT_LOGIN);
                }}
              />
            </>
          ) : (
            <>
              <p>
                Indiquez l’adresse e-mail associée à votre compte. Vous allez
                recevoir un lien pour réinitialiser votre mot de passe.
              </p>
              <Input
                label="Email"
                required
                inputType="text"
                inputName="email"
                colSpanWidth="12"
                attribute="email"
                setAction={setEmail}
              />

              {error && <Error error={error}/>}

              <Button
                className="text-sm text-blue-900 cursor-pointer hover:underline"
                buttonText="Continuer"
                action={() => {
                  requestNewPassword(email, setRequestIsDone, setError);
                }}
              />
            </>
          )}
        </>
      </div>
      <ToastContainer />
    </div>
  );
};

export default PasswordLost;
