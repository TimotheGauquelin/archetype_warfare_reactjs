import React, { useEffect, useState } from "react";
import Button from "../components/generic/Button";
import { useNavigate, useParams } from "react-router-dom";
import { getUserByResetPasswordToken, updatePassword } from "../services/user";
import { InputPassword } from "../components/generic/form/InputPassword";
import ErrorText from "../components/generic/ErrorText";

const PasswordReset = () => {
  const [user, setUser] = useState({});
  const [form, setForm] = useState({
    password: "",
    confirmationPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorAxios, setErrorAxios] = useState(null);

  const { resetToken } = useParams();
  const navigate = useNavigate();

  console.log(resetToken);
  console.log(user.id);

  const updateUserPassword = () => {
    setErrorMessage(null);
    if (form.password === form.confirmationPassword) {
      updatePassword(user.id, form, navigate, setErrorAxios);
    } else {
      setErrorMessage("Les mots de passe ne sont pas identiques");
    }
  };

  useEffect(() => {
    getUserByResetPasswordToken(setUser, resetToken, navigate);
  }, []);

  return user ? (
    <div className="bg-graybackground w-screen h-screen fixed left-0 top-0 flex justify-center items-center">
      <div
        className={`bg-white w-[500px] max-w-[500px] cardShadow rounded-xl flex flex-col p-6`}
      >
        <h3 className="text-2xl text-center mb-4">Réinitialiser</h3>
        <div>
          <p>
            Indiquez ci-dessous l'e-mail avec lequel vous vous êtes inscrit.
          </p>
          <InputPassword
            label="Mot de passe"
            required
            attribute="password"
            setAction={setForm}
          />
          <InputPassword
            label="Confirmation de Mot de passe"
            required
            attribute="confirmationPassword"
            setAction={setForm}
          />

          {errorMessage && <p>{errorMessage}</p>}
          {!errorMessage &&
            errorAxios &&
            errorAxios.map((error) => {
              return <ErrorText errorText={error.message} />;
            })}

          <Button
            className="bg-black text-white w-full p-2 rounded"
            action={() => {
              updateUserPassword();
            }}
            buttonText="Valider"
          />
        </div>
      </div>
    </div>
  ) : (
    <div>
      <p>Vous allez être redirigé..</p>
    </div>
  );
};

export default PasswordReset;
