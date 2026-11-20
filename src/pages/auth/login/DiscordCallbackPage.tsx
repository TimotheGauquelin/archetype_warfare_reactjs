import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import type { AppDispatch } from "@/redux/store";
import { URL_FRONT_HOME, URL_FRONT_LOGIN } from "@/constant/urlsFront";
import ErrorText from "@/components/generic/ErrorText";
import Button from "@/components/generic/buttons/classicButton/Button";
import { fetchAuthMe } from "@/services/auth";

const DiscordCallbackPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const pending = searchParams.get("pending");
  const error = searchParams.get("error");
  const infoMessage = searchParams.get("message");
  const authOk = searchParams.get("auth") === "1";

  const statusText = useMemo(() => {
    if (error) return error;
    if (pending) return infoMessage || t("auth.discordPendingApproval");
    return t("auth.discordConnecting");
  }, [error, pending, infoMessage, t]);

  useEffect(() => {
    if (error) {
      setIsError(true);
      setMessage(error);
      return;
    }

    if (pending) {
      setIsError(false);
      setMessage(infoMessage || t("auth.discordPendingApproval"));
      return;
    }

    if (!authOk) {
      setIsError(true);
      setMessage(t("auth.discordMissingToken"));
      return;
    }

    let cancelled = false;
    setIsConnecting(true);
    void (async () => {
      const ok = await fetchAuthMe(dispatch);
      if (cancelled) return;
      if (ok) {
        navigate(URL_FRONT_HOME, { replace: true });
        return;
      }
      setIsConnecting(false);
      setIsError(true);
      setMessage(t("auth.discordInvalidToken"));
    })();

    return () => {
      cancelled = true;
    };
  }, [authOk, pending, error, infoMessage, dispatch, navigate, t]);

  if (isConnecting && !error && !pending) {
    return (
      <div className="bg-graybackground w-screen min-h-screen fixed left-0 top-0 flex justify-center items-center p-4">
        <div className="bg-white w-full max-w-[400px] cardShadow rounded-xl p-6 text-center">
          <p>{t("auth.discordConnecting")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-graybackground w-screen min-h-screen fixed left-0 top-0 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-[400px] cardShadow rounded-xl flex flex-col p-6 gap-4">
        <h3 className="text-xl text-center font-semibold">{t("auth.discordTitle")}</h3>
        {isError ? (
          <ErrorText errorText={message || statusText} />
        ) : (
          <p className="text-center text-sm">{message || statusText}</p>
        )}
        <Button
          className="bg-black text-white w-full p-3 rounded font-medium"
          buttonText={t("auth.goToLogin")}
          action={() => navigate(URL_FRONT_LOGIN)}
        />
      </div>
    </div>
  );
};

export default DiscordCallbackPage;
