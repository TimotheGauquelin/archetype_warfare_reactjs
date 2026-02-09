import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { URL_FRONT_LOGIN, URL_FRONT_TERMS_AND_CONDITIONS } from "../../../constant/urlsFront";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { InputPassword } from "../../../components/generic/form/inputPassword/InputPassword";
import Button from "../../../components/generic/buttons/classicButton/Button";
import { Input } from "../../../components/generic/form/input/Input";
import { registerUser } from "../../../services/auth";
import ErrorText from "../../../components/generic/ErrorText";
import ErrorMultipleText from "../../../components/generic/ErrorMultipleText";
import OnLoadingButton from "../../../components/generic/buttons/onLoadingButton/OnLoadingButton";

interface RegisterFormData extends Record<string, unknown> {
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  has_accepted_terms_and_conditions: boolean;
}

interface ErrorState {
  message: string | null;
  multipleErrors: Record<string, string[]> | null;
}

const RegisterPage = () => {
  const navigate = useNavigate();
  const [registerData, setRegisterData] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    has_accepted_terms_and_conditions: false,
  });
  const [error, setError] = useState<ErrorState>({
    message: null,
    multipleErrors: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError({ message: null, multipleErrors: null });

    if (registerData.password !== registerData.passwordConfirmation) {
      setError({ message: "Les mots de passe ne correspondent pas", multipleErrors: null });
      return;
    }
    if (!registerData.has_accepted_terms_and_conditions) {
      setError({ message: "Veuillez accepter les termes et conditions.", multipleErrors: null });
      return;
    }

    setIsLoading(true);
    registerUser({
      username: registerData.username,
      email: registerData.email,
      password: registerData.password,
      hasAcceptedTermsAndConditions: registerData.has_accepted_terms_and_conditions,
    })
      .then((result) => {
        if (result.success) {
          toast.success("Inscription réussie ! Vous recevrez un email lorsque votre compte sera activé.");
          navigate(URL_FRONT_LOGIN);
        } else {
          setError({
            message: result.message ?? "Une erreur s'est produite.",
            multipleErrors: result.multipleErrors ?? null,
          });
          setIsLoading(false);
        }
      })
      .catch(() => {
        setError({
          message: "Une erreur s'est produite lors de l'inscription. Veuillez réessayer.",
          multipleErrors: null,
        });
        setIsLoading(false);
      });
  };

  return (
    <div className="bg-graybackground w-screen min-h-screen fixed left-0 top-0 flex justify-center items-center p-4">
      <div
        className={`bg-white w-full max-w-[400px] cardShadow rounded-xl flex flex-col p-4 sm:p-6 overflow-y-auto max-h-[95vh]`}
      >
        <div>
          <h3 className="text-xl sm:text-2xl text-center mb-4">Créer mon compte</h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Input
                label="Nom d'utilisateur"
                required
                inputType="text"
                inputName="username"
                colSpanWidth={12}
                attribute="username"
                data={registerData}
                setAction={setRegisterData}
                disabled={isLoading}
              />
            </div>

            <div className="mb-4">
              <Input
                label="Email"
                required
                inputType="email"
                inputName="email"
                colSpanWidth={12}
                attribute="email"
                data={registerData}
                setAction={setRegisterData}
                disabled={isLoading}
              />
            </div>

            <div className="mb-4">
              <InputPassword
                label="Mot de passe"
                required
                colSpanWidth={12}
                attribute="password"
                data={registerData}
                setAction={setRegisterData}
                disabled={isLoading}
                name="password"
              />
            </div>

            <div className="mb-4">
              <InputPassword
                label="Confirmation du mot de passe"
                required
                colSpanWidth={12}
                attribute="passwordConfirmation"
                data={registerData}
                setAction={setRegisterData}
                disabled={isLoading}
                name="confirmPassword"
              />
            </div>

            <div
              data-testid="checkbox-container"
              className="mt-4 mb-2 flex items-start"
            >
              <input
                data-testid="checkbox-input"
                type="checkbox"
                id="acceptTerms"
                name="has_accepted_terms_and_conditions"
                checked={registerData.has_accepted_terms_and_conditions}
                onChange={(e) =>
                  setRegisterData({ ...registerData, has_accepted_terms_and_conditions: e.target.checked })
                }
                className="mt-1 mr-2"
                disabled={isLoading}
              />
              <label htmlFor="acceptTerms" className="text-sm">
                J'accepte les{" "}
                <button
                  type="button"
                  onClick={() => navigate(URL_FRONT_TERMS_AND_CONDITIONS)}
                  className="text-blue-600 hover:underline"
                  disabled={isLoading}
                >
                  termes et conditions
                </button>{" "}
                du site
              </label>
            </div>

            {error.multipleErrors && (
              <ErrorMultipleText multipleErrors={JSON.stringify(error.multipleErrors)} />
            )}
            {error.message && !error.multipleErrors && (
              <ErrorText errorText={error.message} />
            )}

            <OnLoadingButton
              submit
              buttonText="Créer mon compte"
              className="bg-black text-white w-full p-2 my-2 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isLoading}
              loading={isLoading}
              loadingText="Inscription en cours.."
              action={() => {}}
            />
          </form>
        </div>

        <div className="text-center">
          <span className="text-sm text-gray-600">Déjà un compte ? </span>
          <Button
            buttonText="Se connecter"
            className="text-sm text-blue-900 cursor-pointer hover:underline"
            action={() => navigate(URL_FRONT_LOGIN)}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
