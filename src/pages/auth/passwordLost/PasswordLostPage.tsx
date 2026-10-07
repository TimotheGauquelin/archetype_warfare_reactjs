import { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
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
import type { RootState } from "../../../types";

const initialState: PasswordRequestResult = {};

const PasswordLostPage = () => {
  const { t } = useTranslation();
  const [log, setLog] = useState<{ email: string }>({ email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const locale = useSelector((state: RootState) => state.locale?.value ?? "fr");

  const navigate = useNavigate();

  const [state, formAction, isPending] = useActionState(
    async (_prevState: PasswordRequestResult, formData: FormData): Promise<PasswordRequestResult> => {
      const email = (formData.get("email") as string)?.trim() ?? "";
      const formLocale = (formData.get("locale") as string)?.trim();
      const mailLocale = formLocale === "en" || formLocale === "fr" ? formLocale : "fr";

      if (!email || !email.includes("@")) {
        return { error: t("auth.invalidEmail") };
      }

      return requestNewPasswordWithResult({ email, locale: mailLocale });
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
                {t("auth.passwordLostSuccessTitle")}
              </h3>
            </div>
            <div className="bg-green-100 rounded p-4 mb-4">
              <p className="text-sm sm:text-base text-green-700">
                {t("auth.passwordLostSuccessBody")}
              </p>
            </div>
            <Button
              className="bg-black text-white w-full mt-2 p-3 rounded font-medium transition-all duration-200"
              buttonText={t("auth.backToLogin")}
              action={() => navigate(URL_FRONT_LOGIN)}
            />
          </>
        ) : (
          <>
            <h3 className="text-xl sm:text-2xl text-center mb-4 font-semibold">
              {t("auth.passwordLostTitle")}
            </h3>
            <div>
              <p className="text-base text-gray-600 mb-4">
                {t("auth.passwordLostIntro")}
              </p>

              <form onSubmit={handleSubmit}>
                <input type="hidden" name="locale" value={locale} />
                <div className="mb-4">
                  <Input
                    label={t("auth.email")}
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
                  buttonText={t("auth.passwordLostSubmit")}
                  className="bg-black text-white w-full mt-2 p-3 rounded font-medium transition-all duration-200"
                  disabled={isFormBusy}
                  loading={isFormBusy}
                  loadingText={t("auth.passwordLostLoading")}
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
