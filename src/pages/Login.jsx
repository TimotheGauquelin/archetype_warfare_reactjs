/* eslint-disable no-unused-vars */

import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  const [log, setLog] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const dispatch = useDispatch();

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
            logIn(log, dispatch, navigate, setError);
          }}
        />
        <div className="flex-grow h-[1px] m-2 bg-gray-300"> </div>

        <div className="text-center space-y-2">
          <Button
            buttonText="Mot de passe oublié ?"
            className="text-sm text-blue-900 cursor-pointer hover:underline"
            action={() => navigate(URL_FRONT_PASSWORD_LOST)}
          />
          <div>
            <span className="text-sm text-gray-600">
              Pas encore de compte ?{" "}
            </span>
            <Button
              buttonText="S'inscrire"
              className="text-sm text-blue-900 cursor-pointer hover:underline"
              action={() => navigate(URL_FRONT_REGISTER)}
            />
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Login;
