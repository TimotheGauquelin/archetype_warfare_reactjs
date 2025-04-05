/* eslint-disable no-unused-vars */

import React, { useContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { URL_FRONT_PASSWORD_LOST } from "../constant/urlsFront";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { InputPassword } from "../components/generic/form/InputPassword.jsx";
import Button from "../components/generic/Button";
import { Input } from "../components/generic/form/Input.jsx";
import { logIn } from "../services/auth.js";
import AuthContext from "../context/AuthContext.js";
import ErrorText from "../components/generic/ErrorText.jsx";
import api_aw from "../api/api_aw.jsx";
import { SiDiscord } from "react-icons/si";
import ButtonWithIcon from "../components/generic/ButtonWithIcon.jsx";
import SubtitleDivider from "../components/generic/SubtitleDivider.jsx";

const Login = () => {
  const navigate = useNavigate();

  const [log, setLog] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const { setAuthUser } = useContext(AuthContext);

  return (
    <div className="bg-graybackground w-screen h-screen fixed left-0 top-0 flex justify-center items-center">
      <div
        className={`bg-white w-[400px] max-w-[400px] cardShadow rounded-xl flex flex-col p-6`}
      >
        <div>
          <h3 className="text-2xl text-center mb-4">Connectez-vous</h3>

          <Input
            label="Email"
            required
            inputType="text"
            inputName="email"
            colSpanWidth="12"
            attribute="email"
            setAction={setLog}
          />

          <InputPassword
            label="Password"
            required
            colSpanWidth="12"
            attribute="password"
            setAction={setLog}
          />
        </div>
        {/* {isFetching || onLoading ? (
          <Loader />
        ) : ( */}
        {error && <ErrorText errorText={error} />}

        <Button
          buttonText="Se connecter"
          className="bg-black text-white w-full p-2 mb-2 rounded-md"
          // disabled={isFetching || onLoading}
          action={() => {
            logIn(log, setAuthUser, navigate, setError);
          }}
        />
        <div className="flex-grow h-[1px] bg-gray-300"> </div>
        <ButtonWithIcon
          className="flex justify-center items-center my-2 text-white bg-[#7984F5] hover:bg-[#5B66C3] border border-gray-300 rounded-md shadow-md px-6 py-2 text-sm font-medium"
          action={() => {
            api_aw
              .get("/authenticate/discord/redirect")
              .then((response) => {
                window.location.href = response.data.url;
                // window.location.href = `https://discord.com/oauth2/authorize?client_id=1285141964190384128&scope=bot&permissions=8&guild_id=921848766913450004`;
              })
              .catch((error) => setError(error.response.data.message));
          }}
        >
          <SiDiscord />
          <span className="ml-2">Continuer avec Discord</span>
        </ButtonWithIcon>

        <div className="text-center ">
          <Button
            buttonText="Mot de passe oublié ?"
            className="text-sm text-blue-900 cursor-pointer hover:underline"
            action={() => navigate(URL_FRONT_PASSWORD_LOST)}
          />
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Login;
