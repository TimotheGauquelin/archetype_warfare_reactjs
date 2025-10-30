import jwtDecode from "jwt-decode";
import api_aw from "../api/api_aw";
import { URL_BACK_LOGIN, URL_BACK_REGISTER, URL_BACK_REQUEST_NEW_PASSWORD } from "../constant/urlsBack";
import { URL_FRONT_HOME, URL_FRONT_LOGIN } from "../constant/urlsFront";
import { setUser, clearUser } from "../redux/slice/userSlice";


/**
 * Log in a user.
 * @param {object} user - User object.
 * @param {function} dispatch - Dispatch function.
 * @param {function} navigate - Navigation function.
 * @param {function} setError - Function to set the error.
 * @param {function} setIsLoading - Function to set the loading state.
 * @returns {Promise<void>} - Promise indicating the completion of the operation.
 */
export const logIn = (user, dispatch, navigate, setError, setIsLoading) => {
  api_aw
    .post(URL_BACK_LOGIN, user)
    .then((response) => {
      if (response.status === 200) {
        setIsLoading(false);
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
    .catch((error) => {
      setIsLoading(false);
      if (error.response && error.response.data) {
        if (error.response.status === 429) {
          setError(error.response.data);
        } else {
          setError(error.response.data.message);
        }
      } else {
        setError("Une erreur est survenue lors de la connexion. Veuillez réessayer.");
      }
    });
};

/**
 * Request a new password.
 * @param {object} email - Email object.
 * @param {function} setRequestIsDone - Function to set the request is done state.
 * @param {function} setError - Function to set the error.
 * @param {function} setIsLoading - Function to set the loading state.
 * @returns {Promise<void>} - Promise indicating the completion of the operation.
 */
export const requestNewPassword = (email, setRequestIsDone, setError, setIsLoading) => {
  api_aw
    .post(URL_BACK_REQUEST_NEW_PASSWORD, email)
    .then((response) => {
      if (response.status === 200) {
        setIsLoading(false);
        setRequestIsDone(true);
      }
    })
    .catch((error) => {
      setIsLoading(false);
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError("Une erreur est survenue lors de l'envoi de l'email. Veuillez réessayer.");
      }
    });
};

/**
 * Register a new user.
 * @param {object} userData - User data object.
 * @param {function} navigate - Navigation function.
 * @param {function} toast - Toast function.
 * @param {function} setError - Function to set the error.
 * @param {function} setIsLoading - Function to set the loading state.
 * @returns {Promise<void>} - Promise indicating the completion of the operation.
 */
export const register = (userData, navigate, toast, setError, setIsLoading) => {
  console.log(userData);
  api_aw
    .post(URL_BACK_REGISTER, userData)
    .then((response) => {
      if (response.status === 201) {
        navigate(URL_FRONT_LOGIN);
        toast.success("Inscription réussie ! Vous recevrez un email lorsque votre compte sera activé.");
      }
    })
    .catch((error) => {
      console.log(error);
      setIsLoading(false);
      if (error.response.data) {
        if (error.response.status === 429) {
          setError({message: error.response.data, multipleErrors: null});
        } else {
          setError({message: error.response.data.message, multipleErrors: null});
        }
      } else {
        setError("Une erreur s'est produite lors de l'inscription. Veuillez réessayer.");
      }
    });
};

export const logOut = (dispatch, navigate) => {
  dispatch(clearUser());
  navigate(URL_FRONT_HOME);
};