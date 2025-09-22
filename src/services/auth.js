import jwtDecode from "jwt-decode";
import api_aw from "../api/api_aw";
import { URL_BACK_LOGIN, URL_BACK_REGISTER, URL_BACK_REQUEST_NEW_PASSWORD } from "../constant/urlsBack";
import { URL_FRONT_HOME, URL_FRONT_LOGIN } from "../constant/urlsFront";
import { setUser, clearUser } from "../redux/slice/userSlice";

export const logIn = (user, dispatch, navigate, setError) => {
  api_aw
    .post(URL_BACK_LOGIN, user)
    .then((response) => {
      if (response.status === 200) {
        const decodedToken = jwtDecode(response.data.token);
                
        dispatch(setUser({
          isAuthenticated: true,
          id: decodedToken.id,
          username: decodedToken.username,
          email: decodedToken.email,
          roles: decodedToken.roles,
          token: response.data.token
        }));
        
        navigate(URL_FRONT_HOME);
      }
    })
    .catch((error) => setError(error.response.data.message));
};

export const requestNewPassword = (email, setRequestIsDone, setError) => {
  api_aw
    .post(URL_BACK_REQUEST_NEW_PASSWORD, email)
    .then((response) => {
      if (response.status === 200) {
        setRequestIsDone(true);
      }
    })
    .catch((error) => {
      console.log(error);
      setError(error.response.data.message);
    });
};

export const register = (userData, navigate, setError) => {
  api_aw
    .post(URL_BACK_REGISTER, userData)
    .then((response) => {
      if (response.status === 201) {
        navigate(URL_FRONT_LOGIN);
        // toast.success("Compte créé avec succès ! Veuillez vérifier votre email pour confirmer votre compte.");
      }
    })
    .catch((error) => {
      console.log(error);
      setError(error.response?.data?.message || "Une erreur s'est produite lors de l'inscription");
    });
};

export const logOut = (dispatch, navigate) => {
  dispatch(clearUser());
  navigate(URL_FRONT_HOME);
};