import { toast } from "react-toastify";
import api_aw from "../../api/api_aw";
import { URL_FRONT_HOME, URL_FRONT_LOGIN } from "../../constant/urlsFront";
import {
  loginFailure,
  loginStart,
  loginSuccess,
  logOut,
  resetPasswordFailure,
  resetPasswordStart,
  resetPasswordSent,
} from "../slice/userSlice";

const register = (setOnLoading, setIsLoginPage, registerSchema) => {
  setOnLoading(true);
  api_aw
    .post("/auth/register", registerSchema)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        toast.success(
          "Votre compte a été crée ! Allez dans votre boite mail pour confirmer votre compte."
        );
        setIsLoginPage(true);
        setOnLoading(false);
      }
    })
    .catch((error) => {
      toast.error(
        `Un problème est survenu lors de l'inscription de votre compte !`
      );
      setOnLoading(false);
    });
};

const login = (dispatch, user, navigate) => {
  dispatch(loginStart());
  try {
    api_aw
      .post("/auth/login", user)
      .then((response) => {
        //Recoit un JWT
        dispatch(loginSuccess(response.data));
        navigate(URL_FRONT_HOME);
      })
      .catch((error) => {
        dispatch(loginFailure());
        toast.error(error.response.data);
      });
  } catch (error) {
    dispatch(loginFailure());
    toast.error(error.response.data);
  }
};

const logout = (dispatch, navigate) => {
  dispatch(logOut());
  navigate(URL_FRONT_HOME);
};

const resetPassword = (dispatch, navigate, email) => {
  dispatch(resetPasswordStart());
  try {
    api_aw
      .post("/public/mail/reset-password", email)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          toast.success("Votre mot de passe a été réinitialisé !");
          dispatch(resetPasswordSent());
          navigate(URL_FRONT_LOGIN);
        }
      })
      .catch((error) => {
        dispatch(resetPasswordFailure());
        toast.error(error.response.data);
      });
  } catch (error) {
    dispatch(resetPasswordFailure());
    toast.error(error.response.data);
  }
};

export { register, login, logout, resetPassword };
