import { useEffect, useState } from "react";
import { useActionState } from "../../../hooks/useActionState";
import { useNavigate, useParams } from "react-router-dom";
import { getUserByResetPasswordToken, updatePasswordWithResult, type PasswordResetResult } from "../../../services/user";
import { InputPassword } from "../../../components/generic/form/inputPassword/InputPassword";
import ErrorText from "../../../components/generic/ErrorText";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import ErrorMultipleText from "../../../components/generic/ErrorMultipleText";
import type { User, PasswordUpdateForm } from "../../../types";
import OnLoadingButton from "../../../components/generic/buttons/onLoadingButton/OnLoadingButton";
import { URL_FRONT_LOGIN } from "../../../constant/urlsFront";

const initialState: PasswordResetResult = {};

const PasswordResetPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<PasswordUpdateForm>({
    password: "",
    confirmPassword: "",
  });
  const [errorMessageFromURLToken, setErrorMessageFromURLToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { resetToken } = useParams<{ resetToken?: string }>();
  const navigate = useNavigate();

  const [state, formAction, isPending] = useActionState(
    async (_prevState: PasswordResetResult, formData: FormData): Promise<PasswordResetResult> => {
      const password = (formData.get("password") as string) ?? "";
      const confirmPassword = (formData.get("confirmPassword") as string) ?? "";

      if (!password || !confirmPassword) {
        return { error: "Veuillez remplir les deux champs." };
      }
      if (password !== confirmPassword) {
        return { error: "Les mots de passe ne sont pas identiques" };
      }
      if (!user?.id) {
        return { error: "Session invalide. Veuillez utiliser à nouveau le lien reçu par email." };
      }

      const result = await updatePasswordWithResult(user.id, { password, confirmPassword });

      if (result.success) {
        toast.success("Mot de passe modifié avec succès !");
        setTimeout(() => {
          navigate(URL_FRONT_LOGIN);
        }, 2000);
      }
      return result;
    },
    initialState
  );

  useEffect(() => {
    if (resetToken) {
      getUserByResetPasswordToken(
        resetToken,
        (v) => setUser(prev => typeof v === 'function' ? (v as (p: User | null) => User | null)(prev) : v),
        (v) => setErrorMessageFromURLToken(prev => typeof v === 'function' ? (v as (p: string | null) => string | null)(prev) : v),
        navigate
      );
    }
  }, [resetToken, navigate]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setIsSubmitting(true);
      formAction(formData);
  };

  const isFormBusy = isPending || isSubmitting;

  return (
    <div className="bg-graybackground w-screen min-h-screen fixed left-0 top-0 flex justify-center items-center p-4">
      <div
        className={`bg-white w-full max-w-[400px] cardShadow rounded-xl flex flex-col p-4 sm:p-6`}
      >
        {user && !errorMessageFromURLToken ? (
          <>
            <h3 className="text-xl sm:text-2xl text-center mb-4 font-semibold">
              Réinitialiser le mot de passe
            </h3>
            <div>
              <p className="text-base text-gray-600 mb-4">
                Créez un nouveau mot de passe pour votre compte.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <InputPassword
                    label="Mot de passe"
                    required
                    colSpanWidth="12"
                    attribute="password"
                    data={form}
                    setAction={setForm}
                    disabled={isFormBusy}
                    name="password"
                  />
                </div>

                <div className="mb-4">
                  <InputPassword
                    label="Confirmation du mot de passe"
                    required
                    colSpanWidth="12"
                    attribute="confirmPassword"
                    data={form}
                    setAction={setForm}
                    disabled={isFormBusy}
                    name="confirmPassword"
                  />
                </div>

                {state?.error && (
                  <ErrorText errorText={state.error} errorTextCenter />
                )}

                {state?.multipleErrors && (
                  <ErrorMultipleText multipleErrors={typeof state.multipleErrors === 'string' ? state.multipleErrors : JSON.stringify(state.multipleErrors)} />
                )}

                <OnLoadingButton
                  submit
                  buttonText="Valider"
                  className="bg-black text-white w-full mt-2 p-3 rounded font-medium transition-all duration-200"
                  disabled={isFormBusy}
                  loading={isFormBusy}
                  loadingText="Modification en cours..."
                  action={() => {}}
                />
              </form>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-sm sm:text-base text-gray-700">{errorMessageFromURLToken}</p>
            <p className="mt-2 text-sm text-gray-500">
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
  );
};

export default PasswordResetPage;
