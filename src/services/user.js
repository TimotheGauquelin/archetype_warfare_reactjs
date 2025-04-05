import api_aw from "../api/api_aw";
import { URL_BACK_ADD_USER, URL_BACK_DELETE_USER, URL_BACK_GET_ALL_USERS, URL_BACK_GET_USER_BY_RESET_PASSWORD_TOKEN, URL_BACK_SEARCH_USERS, URL_BACK_SWITCH_USER_IS_ACTIVE, URL_BACK_SWITCH_USER_IS_FORBIDDEN, URL_BACK_UPDATE_PASSWORD } from "../constant/urlsBack";
import { URL_FRONT_ADMIN_USERS, URL_FRONT_HOME, URL_FRONT_LOGIN } from "../constant/urlsFront";

/**
 * Retrieve all users.
 * @param {function} setUsers - Hook to set the list of users.
 * @returns {Promise<void>} - Promise indicating the completion of the operation.
 */
export const getUsers = (setUsers) => {
  api_aw.get(URL_BACK_GET_ALL_USERS).then((response) => {
    if (response.status === 200) {
      setUsers(response.data);
    }
  });
};

/**
 * Search users based on criteria and pagination.
 * @param {number} size - Number of users per page.
 * @param {object} pagination - Pagination object with necessary page data.
 * @param {object} criteria - Search criteria.
 * @param {function} setUsers - Hook to set the list of users.
 * @returns {Promise<void>} - Promise indicating the completion of the operation.
 */
export const searchUsers = (size, pagination, criteria, setUsers) => {
  api_aw
    .get(
      URL_BACK_SEARCH_USERS(size, pagination, criteria.username)
    )
    .then((response) => {
      if (response.status === 200) {
        setUsers(response.data)
      }
    });
};

export const getUserByResetPasswordToken = (setUser, resetPasswordToken, navigate) => {
  api_aw
    .get(
      URL_BACK_GET_USER_BY_RESET_PASSWORD_TOKEN(resetPasswordToken)
    )
    .then((response) => {
      console.log(response);
      if (response.status === 200) {
        setUser(response.data)
      }
    }).catch((error) => {
      // setTimeOutNavigator(navigate, URL_FRONT_HOME, 5000)
    })
};

export const addUser = (newUser, navigate) => {
  api_aw
    .post(URL_BACK_ADD_USER, newUser)
    .then((response) => {
      console.log("là");
      if (response.status === 201) {
        navigate(URL_FRONT_ADMIN_USERS);
      }
    })
    .catch((error) => console.log(error));
};

export const switchIsActive = (userId, setRefresh) => {
  api_aw
    .put(URL_BACK_SWITCH_USER_IS_ACTIVE(userId))
    .then((response) => {
      if (response.status === 200) {
        setRefresh(true);
      }
    })
    .catch((error) => console.log(error));
};

export const switchIsForbidden = (userId, setRefresh) => {
  api_aw
    .put(URL_BACK_SWITCH_USER_IS_FORBIDDEN(userId))
    .then((response) => {
      if (response.status === 200) {
        setRefresh(true);
      }
    })
    .catch((error) => console.log(error));
};

export const updatePassword = (userId, form, navigate, setError) => {
  api_aw
    .put(URL_BACK_UPDATE_PASSWORD(userId), form)
    .then((response) => {
      if (response.status === 200) {
        navigate(URL_FRONT_LOGIN);
      }
    })
    .catch((error) => {
      console.log(error)
      setError(error.response.data.errors)
    });
};

/*
* Retrieve all users.
* @param userId - Id of the user.
* @param {function} setDisplayDeletePopUp - Function to display pop up
* @param {function} navigate - Hook to navigate among pages.
* @returns {Promise<void>} - Promise indicating the completion of the operation.
*/
export const deleteUser = (userId, setDisplayDeletePopUp, setAuthUser, navigate) => {
  api_aw
    .delete(URL_BACK_DELETE_USER(userId))
    .then((response) => {
      if (response.status === 200) {
        setDisplayDeletePopUp(false);
        setAuthUser({})
        navigate(URL_FRONT_HOME);
      }
    })
    .then((error) => console.log(error));
}
