import { useEffect, useState } from "react";
import { useActionState } from "../../../hooks/useActionState";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  URL_FRONT_PASSWORD_LOST,
  URL_FRONT_REGISTER,
} from "../../../constant/urlsFront";
import { InputPassword } from "../../../components/generic/form/inputPassword/InputPassword";
import { Input } from "../../../components/generic/form/input/Input";
import { logIn, type LoginResult } from "../../../services/auth";
import ErrorText from "../../../components/generic/ErrorText";
import { getConfig } from "../../../services/websiteactions";
import OnLoadingButton from "../../../components/generic/buttons/onLoadingButton/OnLoadingButton";
import { laborIllusion } from "../../../utils/functions/laborIllusion/laborIllusion";

const initialState: LoginResult = {};

const LoginPage = () => {

  const [config, setConfig] = useState<{ registration_enabled?: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [log, setLog] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });

  const [state, formAction, isPending] = useActionState(
    async (_prevState: LoginResult, formData: FormData) => {
      const email = (formData.get("email") as string)?.trim() ?? "";
      const password = (formData.get("password") as string) ?? "";

      if (!email || !email.includes("@")) {
        return { error: "Veuillez saisir une adresse email valide" };
      }
      if (!password) {
        return { error: "Veuillez saisir votre mot de passe" };
      }

      return logIn(
        { email, password },
        dispatch,
        navigate
      );
    },
    initialState
  );

  useEffect(() => {
    getConfig(setConfig);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setIsSubmitting(true);
    laborIllusion(() => {
      formAction(formData);
      setIsSubmitting(false);
    }, 0.5);
  };

  const isFormBusy = isPending || isSubmitting;

  return (
    <div className="bg-graybackground w-screen min-h-screen fixed left-0 top-0 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-[400px] cardShadow rounded-xl flex flex-col p-4 sm:p-6">
        <div>
          <h3 className="text-xl sm:text-2xl text-center mb-4 font-semibold">
            Connectez-vous
          </h3>

          <form className="flex flex-col" onSubmit={handleSubmit}>
            <div className="mb-4">
              <Input
                label="Email"
                required
                inputType="email"
                inputName="email"
                colSpanWidth="12"
                attribute="email"
                data={log}
                setAction={setLog}
                disabled={isFormBusy}
              />
            </div>

            <div className="mb-4">
              <InputPassword
                label="Mot de passe"
                required
                colSpanWidth="12"
                attribute="password"
                data={log}
                setAction={setLog}
                disabled={isFormBusy}
                name="password"
              />
            </div>

            {state?.error && <ErrorText errorText={state.error} />}

            <OnLoadingButton
              submit
              buttonText="Se connecter"
              className="bg-black text-white w-full mt-2 p-3 rounded font-medium transition-all duration-200"
              disabled={isFormBusy}
              loading={isFormBusy}
              loadingText="Connexion en cours..."
              action={() => { }}
            />
          </form>
        </div>

        <div className="flex-grow h-[1px] m-2 bg-gray-300" />

        <div className="text-center space-y-2">
          <OnLoadingButton
            buttonText="Mot de passe oublié ?"
            className="text-sm text-blue-900 cursor-pointer hover:underline transition-all duration-200"
            action={() => navigate(URL_FRONT_PASSWORD_LOST)}
          />
          {config?.registration_enabled === true && (
            <div>
              <Link
                to={URL_FRONT_REGISTER}
                className="text-sm text-blue-900 cursor-pointer hover:underline transition-all duration-200"
              >
                Créer un compte
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
