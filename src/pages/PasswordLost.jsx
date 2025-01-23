import { Field, Form, Formik } from "formik";
import React from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormikStringInput } from "../components/formik/FormikStringInput";
import { genericYup } from "../constant/genericYup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/generic/Loader";
import { resetPassword } from "../redux/apiCall/user";
import FormikBlockWithLabel from "../components/formik/FormikBlockWithLabel";
import Button from "../components/generic/Button";

const PasswordLost = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isFetching, isResetingPassword } = useSelector((state) => state.user);

  let passwordLostSchema = yup.object().shape({
    email: genericYup.email,
  });

  const resetpassword = (values) => {
    dispatch(resetPassword(dispatch, navigate, values.email));
  };

  return (
    <div className="bg-graybackground w-screen h-screen fixed left-0 top-0 flex justify-center items-center">
      <div
        className={`bg-white w-[300px] max-w-[300px] cardShadow rounded-xl flex flex-col p-6`}
      >
        <Formik
          initialValues={{
            email: "",
          }}
          validationSchema={passwordLostSchema}
          onSubmit={(values) => resetpassword(values)}
        >
          <Form className="">
            <div className="inline-block mt-2 text-black">
              <h3 className="text-2xl text-center mb-4">Réinitialiser</h3>

              {isResetingPassword ? (
                <p>
                  Vous avez déjà fait une demande de mot de passe oublié.
                  Regardez vos mails !
                </p>
              ) : (
                <div>
                  <p>
                    Indiquez ci-dessous l'e-mail avec lequel vous vous êtes
                    inscrit.
                  </p>
                  <FormikBlockWithLabel label="Email" requiredInput>
                    <Field name="email" component={FormikStringInput} email />
                  </FormikBlockWithLabel>
                  {isFetching ? (
                    <Loader />
                  ) : (
                    <Button
                      className="bg-black text-white w-full p-2 rounded"
                      submit
                      buttonText="Valider"
                    />
                  )}{" "}
                </div>
              )}
            </div>
          </Form>
        </Formik>
        <div className="text-center mt-2">
          <Button
            className="text-sm text-blue-900 cursor-pointer hover:underline"
            buttonText="Revenir à la page de connexion"
            action={() => {
              navigate(-1);
            }}
          ></Button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default PasswordLost;
