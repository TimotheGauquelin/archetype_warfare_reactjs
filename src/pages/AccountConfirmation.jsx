import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api_aw from "../api/api_aw";
import Header from "../components/generic/header/Header";
import { URL_BACK_CONFIRMATION_TOKEN } from "../constant/urlsBack";
import { URL_FRONT_HOME } from "../constant/urlsFront";

const AccountConfirmation = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const updateConfirmationToken = () => {
    api_aw.put(URL_BACK_CONFIRMATION_TOKEN(token)).then((response) => {
      if (response.status === 200 || response.status === 201) {
        setTimeout(() => {
          navigate(URL_FRONT_HOME);
        }, "5000");
      }
    });
  };

  useEffect(() => {
    updateConfirmationToken();
  });

  return (
    <div>
      <Header />
      <div className="text-center mt-5 mx-1">
        <div className="inline-block bg-gray-100 p-5 rounded-lg">
          <p className="text-lg font-bold">
            {" "}
            Félicitation, votre compte est activé !
          </p>
          <p>
            Vous allez être redirigé vers la page d'accueil dans quelques
            secondes..{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountConfirmation;
