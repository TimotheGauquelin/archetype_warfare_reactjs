import api_aw from "../api/api_aw";
import { URL_BACK_ADD_USER, URL_BACK_CREATE_USER_BY_ADMIN, URL_BACK_DELETE_USER, URL_BACK_GET_ALL_USERS, URL_BACK_GET_USER_BY_ID, URL_BACK_GET_USER_BY_RESET_PASSWORD_TOKEN, URL_BACK_SEARCH_USERS, URL_BACK_SWITCH_USER_IS_ACTIVE, URL_BACK_SWITCH_USER_IS_BANNED, URL_BACK_UPDATE_PASSWORD, URL_BACK_UPDATE_USER_BY_ADMIN } from "../constant/urlsBack";
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

/**
 * Get user by reset password token.
 * @param {function} setUser - Hook to set the user.
 * @param {string} resetPasswordToken - Reset password token.
 * @param {function} navigate - Hook to navigate.
 * @returns {Promise<void>} - Promise indicating the completion of the operation.
 */
export const getUserByResetPasswordToken = (resetPasswordToken, setUser, setError, navigate) => {
  try {
    api_aw
      .get(
        URL_BACK_GET_USER_BY_RESET_PASSWORD_TOKEN(resetPasswordToken)
      )
      .then((response) => {
        if (response.status === 200) {
          setUser(response.data);
        }
      }).catch((error) => {
        if (error.response.status === 400) {
          setError(error.response.data.message);
          setTimeout(() => {
            navigate(URL_FRONT_LOGIN);
          }, 5000);
        }
        if (error.response.status === 404) {
          setError("Le lien de réinitialisation de mot de passe est invalide");
          setTimeout(() => {
            navigate(URL_FRONT_HOME);
          }, 5000);
        }
      })
  } catch (error) {
    console.log(error);
  }
};

/**
 * Get user by id.
 * @param {string | number} userId - User id.
 * @param {function} setUser - Hook to set user.
 * @returns {Promise<void>} - Promise indicating the completion of the operation.
 */
export const getUserById = (userId, setUser) => {
  api_aw
    .get(URL_BACK_GET_USER_BY_ID(userId))
    .then((response) => {
      if (response.status === 200) {
        setUser(response.data)
      }
    }).catch((error) => console.log(error));
}

/**
 * Add a user.
 * @param {object} newUser - New user object.
 * @param {function} navigate - Hook to navigate.
 * @returns {Promise<void>} - Promise indicating the completion of the operation.
 */
export const addUser = (newUser, navigate) => {
  api_aw
    .post(URL_BACK_ADD_USER, newUser)
    .then((response) => {
      if (response.status === 201) {
        navigate(URL_FRONT_ADMIN_USERS);
      }
    })
    .catch((error) => console.log(error));
};

export const createUserByAdmin = (newUser, navigate) => {
  api_aw
    .post(URL_BACK_CREATE_USER_BY_ADMIN, newUser)
    .then((response) => {
      if (response.status === 201) {
        navigate(URL_FRONT_ADMIN_USERS);
      }
    })
    .catch((error) => console.log(error));
};

/**
 * Switch user 'is active' attribute.
 * @param {string} userId - User id.
 * @param {function} setRefresh - Hook to set refresh.
 * @returns {Promise<void>} - Promise indicating the completion of the operation.
 */
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

/**
 * Switch user 'is banned' attribute.
 * @param {string} userId - User id.
 * @param {function} setRefresh - Hook to set refresh.
 * @returns {Promise<void>} - Promise indicating the completion of the operation.
 */
export const switchIsBanned = (userId, setRefresh) => {
  api_aw
    .put(URL_BACK_SWITCH_USER_IS_BANNED(userId))
    .then((response) => {
      if (response.status === 200) {
        setRefresh(true);
      }
    })
    .catch((error) => console.log(error));
};

/**
 * Update user password.
 * @param {string} userId - User id.
 * @param {object} form - Form object.
 * @param {function} navigate - Hook to navigate.
 * @param {function} setMultipleErrors - Hook to set multiple errors.
 * @param {function} setIsUpdating - Hook to set updating state.
 * @param {function} toast - Toast notification function.
 * @returns {Promise<void>} - Promise indicating the completion of the operation.
 */
export const updatePassword = (userId, form, navigate, setMultipleErrors, setIsUpdating, toast) => {
  api_aw
    .put(URL_BACK_UPDATE_PASSWORD(userId), form)
    .then((response) => {
      if (response.status === 200) {
        // setIsUpdating(false);
        toast.success("Mot de passe modifié avec succès !", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        setTimeout(() => {
          navigate(URL_FRONT_LOGIN);
        }, 2000);
      }
    })
    .catch((error) => {
      setIsUpdating(false);
      if (error.response && error.response.data && error.response.data.message) {
        setMultipleErrors(error.response.data.message);
      } else {
        setMultipleErrors("Une erreur est survenue lors de la modification du mot de passe. Veuillez réessayer.");
      }
    });
};

export const updateUserByAdmin = (userId, form, navigate, toast) => {
  api_aw
    .put(URL_BACK_UPDATE_USER_BY_ADMIN(userId), form)
    .then((response) => {
      if (response.status === 200) {
        navigate(URL_FRONT_ADMIN_USERS);
        toast.success("Utilisateur modifié avec succès");
      }
    })
    .catch((error) => {
      console.log(error);
      toast.error(error.response.data.message);
    });
}

/*
* Retrieve all users.
* @param userId - Id of the user.
* @param {function} setDisplayDeletePopUp - Function to display pop up
* @param {function} navigate - Hook to navigate among pages.
* @returns {Promise<void>} - Promise indicating the completion of the operation.
*/
export const deleteUser = (userId, navigate) => {
  api_aw
    .delete(URL_BACK_DELETE_USER(userId))
    .then((response) => {
      if (response.status === 200) {
        navigate(URL_FRONT_HOME);
      }
    })
    .then((error) => console.log(error));
}

export const deleteUserByAdmin = (userId, setRefresh) => {
  api_aw
    .delete(URL_BACK_DELETE_USER(userId))
    .then((response) => {
      if (response.status === 200) {
        setRefresh(true);
      }
    })
    .catch((error) => console.log(error));
}