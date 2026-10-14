import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useActionState } from "../../../hooks/useActionState";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  URL_FRONT_PASSWORD_LOST,
  URL_FRONT_REGISTER,
} from "../../../constant/urlsFront";
import { URL_BACK_DISCORD_AUTH } from "../../../constant/urlsBack";
import { InputPassword } from "../../../components/generic/form/inputPassword/InputPassword";
import { Input } from "../../../components/generic/form/input/Input";
import { logIn, type LoginResult } from "../../../services/auth";
import ErrorText from "../../../components/generic/ErrorText";
import { getConfig } from "../../../services/websiteactions";
import OnLoadingButton from "../../../components/generic/buttons/onLoadingButton/OnLoadingButton";
import { laborIllusion } from "../../../utils/functions/laborIllusion/laborIllusion";
import type { RootState } from "../../../types";

const initialState: LoginResult = {};

const LoginPage = () => {
  const { t } = useTranslation();

  const [config, setConfig] = useState<{ registration_enabled?: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const locale = useSelector((state: RootState) => state.locale?.value ?? "fr");

  const [log, setLog] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });

  const startDiscordLogin = () => {
    const backend = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "") || "";
    window.location.href = `${backend}${URL_BACK_DISCORD_AUTH({ locale, acceptedTerms: false })}`;
  };

  const [state, formAction, isPending] = useActionState(
    async (_prevState: LoginResult, formData: FormData) => {
      const email = (formData.get("email") as string)?.trim() ?? "";
      const password = (formData.get("password") as string) ?? "";

      if (!email || !email.includes("@")) {
        return { error: t("auth.invalidEmail") };
      }
      if (!password) {
        return { error: t("auth.passwordRequired") };
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
            {t("auth.loginTitle")}
          </h3>

          <form className="flex flex-col" onSubmit={handleSubmit}>
            <div className="mb-4">
              <Input
                label={t("auth.email")}
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
                label={t("auth.password")}
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
              buttonText={t("auth.submit")}
              className="bg-black text-white w-full mt-2 p-3 rounded font-medium transition-all duration-200"
              disabled={isFormBusy}
              loading={isFormBusy}
              loadingText={t("auth.submitLoading")}
              action={() => { }}
            />
          </form>

          <div className="text-center mt-2 space-y-2">
            <OnLoadingButton
              buttonText={t("auth.forgotPassword")}
              className="text-sm text-blue-900 cursor-pointer hover:underline transition-all duration-200"
              action={() => navigate(URL_FRONT_PASSWORD_LOST)}
            />
            {config?.registration_enabled === true && (
              <div>
                <Link
                  to={URL_FRONT_REGISTER}
                  className="text-sm text-blue-900 cursor-pointer hover:underline transition-all duration-200"
                >
                  {t("auth.createAccount")}
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 my-4">
            <div className="flex-grow h-[1px] bg-gray-300" />
            <span className="text-xs text-gray-500 uppercase">{t("auth.or")}</span>
            <div className="flex-grow h-[1px] bg-gray-300" />
          </div>

          <button
            type="button"
            onClick={startDiscordLogin}
            disabled={isFormBusy}
            className="w-full p-3 rounded font-medium bg-[#5865F2] text-white hover:opacity-90 transition-all duration-200 disabled:opacity-50"
          >
            {t("auth.continueWithDiscord")}
          </button>
        </div>


      </div>
    </div>
  );
};

export default LoginPage;
