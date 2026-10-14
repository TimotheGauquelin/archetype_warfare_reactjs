import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import jwtDecode from "jwt-decode";
import { setUser } from "@/redux/slice/userSlice";
import type { DecodedToken } from "@/types";
import { URL_FRONT_HOME, URL_FRONT_LOGIN } from "@/constant/urlsFront";
import ErrorText from "@/components/generic/ErrorText";
import Button from "@/components/generic/buttons/classicButton/Button";

const DiscordCallbackPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const token = searchParams.get("token");
  const pending = searchParams.get("pending");
  const error = searchParams.get("error");
  const infoMessage = searchParams.get("message");

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

    if (!token) {
      setIsError(true);
      setMessage(t("auth.discordMissingToken"));
      return;
    }

    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      dispatch(
        setUser({
          isAuthenticated: true,
          id: decodedToken.id,
          username: decodedToken.username,
          email: decodedToken.email,
          roles: decodedToken.roles,
          token,
        })
      );
      navigate(URL_FRONT_HOME, { replace: true });
    } catch {
      setIsError(true);
      setMessage(t("auth.discordInvalidToken"));
    }
  }, [token, pending, error, infoMessage, dispatch, navigate, t]);

  if (token && !error && !pending) {
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
        {isError ? <ErrorText errorText={message || statusText} /> : <p className="text-center text-sm">{message || statusText}</p>}
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
