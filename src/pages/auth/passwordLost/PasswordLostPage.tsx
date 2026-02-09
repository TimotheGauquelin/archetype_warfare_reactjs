import { useState } from "react";
import { useActionState } from "../../../hooks/useActionState";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../../../components/generic/buttons/classicButton/Button";
import { Input } from "../../../components/generic/form/input/Input";
import ErrorText from "../../../components/generic/ErrorText";
import { URL_FRONT_LOGIN } from "../../../constant/urlsFront";
import { requestNewPasswordWithResult, type PasswordRequestResult } from "../../../services/auth";
import OnLoadingButton from "../../../components/generic/buttons/onLoadingButton/OnLoadingButton";
import { laborIllusion } from "../../../utils/functions/laborIllusion/laborIllusion";

const initialState: PasswordRequestResult = {};

const PasswordLostPage = () => {
  const [log, setLog] = useState<{ email: string }>({ email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const [state, formAction, isPending] = useActionState(
    async (_prevState: PasswordRequestResult, formData: FormData): Promise<PasswordRequestResult> => {
      const email = (formData.get("email") as string)?.trim() ?? "";

      if (!email || !email.includes("@")) {
        return { error: "Veuillez saisir une adresse email valide" };
      }

      return requestNewPasswordWithResult({ email });
    },
    initialState
  );

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
      <div
        className={`bg-white w-full max-w-[400px] cardShadow rounded-xl flex flex-col p-4 sm:p-6`}
      >
        {state?.success ? (
          <>
            <div className="text-center mb-4">
              <h3 className="text-xl sm:text-2xl font-semibold">
                Email envoyé !
              </h3>
            </div>
            <div className="bg-green-100 rounded p-4 mb-4">
              <p className="text-sm sm:text-base text-green-700">
                Un e-mail vient de vous être envoyé. Il contient un lien valable 24 heures
                pour réinitialiser votre mot de passe.
              </p>
            </div>
            <Button
              className="bg-black text-white w-full mt-2 p-3 rounded font-medium transition-all duration-200"
              buttonText="Revenir à la page de connexion"
              action={() => navigate(URL_FRONT_LOGIN)}
            />
          </>
        ) : (
          <>
            <h3 className="text-xl sm:text-2xl text-center mb-4 font-semibold">
              Mot de passe oublié ?
            </h3>
            <div>
              <p className="text-base text-gray-600 mb-4">
                Indiquez l'adresse e-mail associée à votre compte. Vous allez recevoir
                un lien pour réinitialiser votre mot de passe.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <Input
                    label="Email"
                    required
                    inputType="email"
                    inputName="email"
                    colSpanWidth={12}
                    attribute="email"
                    data={log}
                    setAction={setLog}
                    disabled={isFormBusy}
                  />
                </div>

                {state?.error && (
                  <ErrorText errorText={state.error} errorTextCenter />
                )}

                <OnLoadingButton
                  submit
                  buttonText="Envoyer le lien"
                  className="bg-black text-white w-full mt-2 p-3 rounded font-medium transition-all duration-200"
                  disabled={isFormBusy}
                  loading={isFormBusy}
                  loadingText="Envoi en cours..."
                  action={() => {}}
                />
              </form>
            </div>
          </>
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
  );
};

export default PasswordLostPage;
