import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
import { URL_FRONT_LOGIN, URL_FRONT_TERMS_AND_CONDITIONS } from "../../../constant/urlsFront";

const initialState: PasswordResetResult = {};

const PasswordResetPage = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<PasswordUpdateForm>({
    password: "",
    confirmPassword: "",
    has_accepted_terms_and_conditions: false,
  });
  const [errorMessageFromURLToken, setErrorMessageFromURLToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { resetToken } = useParams<{ resetToken?: string }>();
  const navigate = useNavigate();

  const [state, formAction, isPending] = useActionState(
    async (_prevState: PasswordResetResult, formData: FormData): Promise<PasswordResetResult> => {
      const password = (formData.get("password") as string) ?? "";
      const confirmPassword = (formData.get("confirmPassword") as string) ?? "";
      const hasAcceptedTerms = formData.get("has_accepted_terms_and_conditions") === "on";

      if (!password || !confirmPassword) {
        return { error: t("auth.passwordResetBothRequired") };
      }
      if (password !== confirmPassword) {
        return { error: t("auth.passwordResetMismatch") };
      }
      if (!hasAcceptedTerms) {
        return { error: t("auth.acceptTermsRequired") };
      }
      if (!user?.id) {
        return { error: t("auth.passwordResetInvalidSession") };
      }

      const result = await updatePasswordWithResult(user.id, {
        password,
        confirmPassword,
        has_accepted_terms_and_conditions: true,
      });

      if (result.success) {
        toast.success(t("auth.passwordResetSuccess"));
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
              {t("auth.passwordResetTitle")}
            </h3>
            <div>
              <p className="text-base text-gray-600 mb-4">
                {t("auth.passwordResetIntro")}
              </p>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <InputPassword
                    label={t("auth.password")}
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
                    label={t("auth.passwordConfirm")}
                    required
                    colSpanWidth="12"
                    attribute="confirmPassword"
                    data={form}
                    setAction={setForm}
                    disabled={isFormBusy}
                    name="confirmPassword"
                  />
                </div>

                <div
                  data-testid="checkbox-container"
                  className="mt-2 mb-4 flex items-start"
                >
                  <input
                    data-testid="checkbox-input"
                    type="checkbox"
                    id="acceptTerms"
                    name="has_accepted_terms_and_conditions"
                    checked={Boolean(form.has_accepted_terms_and_conditions)}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        has_accepted_terms_and_conditions: e.target.checked,
                      })
                    }
                    className="mt-1 mr-2"
                    disabled={isFormBusy}
                  />
                  <label htmlFor="acceptTerms" className="text-sm">
                    {t("auth.acceptTermsPrefix")}{" "}
                    <button
                      type="button"
                      onClick={() => navigate(URL_FRONT_TERMS_AND_CONDITIONS)}
                      className="text-blue-600 hover:underline"
                      disabled={isFormBusy}
                    >
                      {t("auth.acceptTermsLink")}
                    </button>{" "}
                    {t("auth.acceptTermsSuffix")}
                  </label>
                </div>

                {state?.error && (
                  <ErrorText errorText={state.error} errorTextCenter />
                )}

                {state?.multipleErrors && (
                  <ErrorMultipleText multipleErrors={typeof state.multipleErrors === 'string' ? state.multipleErrors : JSON.stringify(state.multipleErrors)} />
                )}

                <OnLoadingButton
                  submit
                  buttonText={t("auth.passwordResetSubmit")}
                  className="bg-black text-white w-full mt-2 p-3 rounded font-medium transition-all duration-200"
                  disabled={isFormBusy}
                  loading={isFormBusy}
                  loadingText={t("auth.passwordResetLoading")}
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
              {t("auth.passwordResetRedirect")}
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
