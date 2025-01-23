/* eslint-disable no-unused-vars */

import React from "react";
import { Field, Form, Formik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { URL_FRONT_PASSWORD_LOST } from "../constant/urlsFront";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../components/generic/Loader";
import { login, register } from "../redux/apiCall/user";
import { useDispatch, useSelector } from "react-redux";
import { FormikPasswordInput } from "../components/formik/FormikPasswordInput";
import { FormikStringInput } from "../components/formik/FormikStringInput";
import FormikBlockWithLabel from "../components/formik/FormikBlockWithLabel";
import { loginOrRegisterAnAccount } from "../constant/formikInitialValues";
import Button from "../components/generic/Button";
import authYupSchema from "../yup/auth.js";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoginPage, setIsLoginPage] = useState(true);
  const [onLoading, setOnLoading] = useState(false);

  const { isFetching, error } = useSelector((state) => state.user);

  let registerAccountSchema = authYupSchema.registerAccountSchema;
  let loginAccountSchema = authYupSchema.loginAccountSchema;

  const onSubmit = (values) => {
    const registerAccountSchema = {
      username: values.username,
      password: values.password,
      email: values.email,
    };

    isLoginPage
      ? login(dispatch, registerAccountSchema, navigate)
      : register(setOnLoading, setIsLoginPage, registerAccountSchema);
  };

  return (
    <div className="bg-graybackground w-screen h-screen fixed left-0 top-0 flex justify-center items-center">
      <div
        className={`bg-white w-[300px] max-w-[300px] cardShadow rounded-xl flex flex-col p-6`}
      >
        <Formik
          initialValues={loginOrRegisterAnAccount}
          validationSchema={
            isLoginPage ? loginAccountSchema : registerAccountSchema
          }
          onSubmit={(values) => onSubmit(values)}
        >
          {() => (
            <Form>
              <div>
                <h3 className="text-2xl text-center mb-4">
                  {isLoginPage ? "Connectez-vous" : "Inscrivez-vous"}
                </h3>

                {!isLoginPage && (
                  <FormikBlockWithLabel label="Email" requiredInput>
                    <Field
                      name="email"
                      component={FormikStringInput}
                      type="email"
                    />
                  </FormikBlockWithLabel>
                )}

                <FormikBlockWithLabel label="Pseudo" requiredInput>
                  <Field name="username" component={FormikStringInput} />
                </FormikBlockWithLabel>
                <FormikBlockWithLabel label="Mot de Passe" requiredInput>
                  <Field name="password" component={FormikPasswordInput} />
                </FormikBlockWithLabel>
                {!isLoginPage && (
                  <FormikBlockWithLabel
                    label="Confirmation de Mot de Passe"
                    requiredInput
                  >
                    <Field
                      name="passwordConfirmation"
                      component={FormikPasswordInput}
                    />
                  </FormikBlockWithLabel>
                )}
              </div>
              {isFetching || onLoading ? (
                <Loader />
              ) : (
                <Button
                  buttonText={isLoginPage ? "Se connecter" : "S'inscrire"}
                  className="bg-black text-white w-full p-2 mb-2 rounded"
                  disabled={isFetching || onLoading}
                  submit
                />
              )}
            </Form>
          )}
        </Formik>

        <div className="text-center ">
          <Button
            buttonText="Mot de passe oublié ?"
            className="text-sm text-blue-900 cursor-pointer hover:underline"
            action={() => navigate(URL_FRONT_PASSWORD_LOST)}
          />
          <p className="font-bold">Vous n'êtes pas inscrit ?</p>
          <Button
            buttonText={isLoginPage ? "Inscrivez-vous" : "Connectez-vous"}
            className="text-sm text-blue-900 cursor-pointer hover:underline"
            action={() => setIsLoginPage(!isLoginPage)}
          />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
