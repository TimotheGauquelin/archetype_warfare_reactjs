import React, { useContext, useState } from "react";
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
import AuthContext from "../../context/AuthContext";
import { deleteUser } from "../../services/user";

const MyProfil = () => {
  const [displayDeletePopUp, setDisplayDeletePopUp] = useState(false);
  const navigate = useNavigate()

  const { authUser } = useContext(AuthContext)

  console.log(authUser.roles);

  return (
    <div>
      <Header />
      <Navbar />
      <ProfilTemplate>
        <div className="flex items-center">
          <h2>Role: </h2>
          <div className="flex flex-row flex-wrap">
            {authUser?.roles?.map((role, index) => {
              return (
                <div key={index} className="p-1 m-1 bg-green-100 rounded-md">
                  {role}
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
                action={() => deleteUser(authUser.id, setDisplayDeletePopUp, navigate)}
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
