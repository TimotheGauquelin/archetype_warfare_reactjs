import React, { useEffect, useState } from "react";
import Button from "../components/generic/Button";
import { useNavigate, useParams } from "react-router-dom";
import { getUserByResetPasswordToken, updatePassword } from "../services/user";
import { InputPassword } from "../components/generic/form/InputPassword";
import ErrorText from "../components/generic/ErrorText";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import ErrorMultipleText from "../components/generic/ErrorMultipleText";

const PasswordReset = () => {
  const [user, setUser] = useState({});
  const [form, setForm] = useState({
    password: "",
    confirmationPassword: "",
  });
  const [error, setError] = useState(null);
  const [multipleErrors, setMultipleErrors] = useState(null);
  const [errorMessageFromURLToken, setErrorMessageFromURLToken] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const { resetToken } = useParams();
  const navigate = useNavigate();

  const updateUserPassword = () => {
    setMultipleErrors(null);
    setError(null);
    
    if (form.password === form.confirmationPassword) {
      setIsUpdating(true);
      updatePassword(user.id, form, navigate, setMultipleErrors, setIsUpdating, toast);
    } else {
      setError("Les mots de passe ne sont pas identiques");
    }
  };

  useEffect(() => {
    getUserByResetPasswordToken(resetToken, setUser, setErrorMessageFromURLToken, navigate);
  }, [resetToken, navigate]);

  return (
    <div className="bg-graybackground w-screen h-screen fixed left-0 top-0 flex justify-center items-center">
      <div
        className={`bg-white w-[400px] max-w-[400px] cardShadow rounded-xl flex flex-col p-6`}
      >
        {user && !errorMessageFromURLToken ? (
          <>
            <h3 className="text-2xl text-center mb-4 font-semibold">
              Réinitialiser le mot de passe
            </h3>
            <div>
              <p className="text-gray-600 mb-4">
                Créez un nouveau mot de passe pour votre compte.
              </p>
              
              <div className="mb-4">
                <InputPassword
                  label="Mot de passe"
                  required
                  attribute="password"
                  setAction={setForm}
                  disabled={isUpdating}
                />
              </div>
              
              <div className="mb-4">
                <InputPassword
                  label="Confirmation du mot de passe"
                  required
                  attribute="confirmationPassword"
                  setAction={setForm}
                  disabled={isUpdating}
                />
              </div>

              {error && (
                <ErrorText errorText={error} errorTextCenter />
              )}

              {multipleErrors && (
                <ErrorMultipleText multipleErrors={multipleErrors} />
              )}

              <Button
                className="bg-black text-white w-full mt-2 p-3 rounded font-medium transition-all duration-200"
                action={updateUserPassword}
                buttonText="Valider"
                disabled={isUpdating}
                loadingText="Modification en cours..."
              />
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-700">{errorMessageFromURLToken}</p>
            <p className="mt-2 text-gray-500 text-sm">
              Vous allez être redirigé vers la page d'accueil dans quelques secondes...
            </p>
          </div>
        )}
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
  )
};

export default PasswordReset;
