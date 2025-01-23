import React, { useState } from "react";
import Header from "../../components/generic/header/Header";
import Navbar from "../../components/pages/userProfil/Navbar";
import ProfilTemplate from "../../components/pages/userProfil/ProfilTemplate";
import Button from "../../components/generic/Button";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import api_aw from "../../api/api_aw";
import { useSelector } from "react-redux";
import { URL_BACK_GET_USER } from "../../constant/urlsBack";
import { URL_FRONT_HOME } from "../../constant/urlsFront";

const MyProfil = () => {
  const { token } = useSelector((state) => state.user);
  var decoded = jwt_decode(token);
  const history = useNavigate();

  const [displayDeletePopUp, setDisplayDeletePopUp] = useState(false);

  const deleteMyAccount = () => {
    api_aw
      .delete(URL_BACK_GET_USER(decoded.idUser))
      .then((response) => {
        if (response.status === 200) {
          setDisplayDeletePopUp(false);
          window.localStorage.removeItem("token");
          history(URL_FRONT_HOME);
        }
      })
      .then((error) => console.log(error));
  };

  return (
    <div>
      <Header />
      <Navbar />
      <ProfilTemplate>
        <div className="flex items-center">
          <h2>Role: </h2>
          <div className="flex flex-row flex-wrap">
            {decoded?.authorities.map((authority, index) => {
              return (
                <div key={index} className="p-1 m-1 bg-green-100 rounded-md">
                  {authority}
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-3">
          <p className="font-bold">Supprimer mon compte :</p>

          <Button
            className="bg-red-400 hover:bg-red-500 p-2 rounded text-white font-bold cursor-pointer"
            buttonText="Supprimer"
            action={() => setDisplayDeletePopUp(true)}
          />
        </div>
        {displayDeletePopUp === true && (
          <div
            style={{ top: "70px", left: "40%" }}
            className="absolute shadow-lg bg-blue-200 p-5 rounded-lg"
          >
            Souhaitez-vous supprimer votre compte ?
            <div className="grid grid-cols-12 gap-2 mt-2">
              <Button
                className="col-span-6 bg-green-400 hover:bg-green-500 p-2 rounded text-white font-bold cursor-pointer"
                buttonText="Oui"
                action={() => deleteMyAccount()}
              />
              <Button
                className="col-span-6 bg-red-400 hover:bg-red-500 p-2 rounded text-white font-bold cursor-pointer"
                buttonText="Non"
                action={() => setDisplayDeletePopUp(false)}
              />
            </div>
          </div>
        )}
      </ProfilTemplate>
    </div>
  );
};

export default MyProfil;
