import jwtDecode from "jwt-decode";
import api_aw from "../api/api_aw";
import { URL_BACK_LOGIN, URL_BACK_REQUEST_NEW_PASSWORD } from "../constant/urlsBack";
import { URL_FRONT_HOME } from "../constant/urlsFront";

export const logIn = (user, setAuthUser, navigate, setError) => {
  api_aw
    .post(URL_BACK_LOGIN, user)
    .then((response) => {
      if (response.status === 200) {
        const decodedToken = jwtDecode(response.data.token);      
        console.log(decodedToken);                
        setAuthUser((prev) => ({
          ...prev,
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