import api_aw from "../../api/api_aw";
import {
  searchErasFailure,
  searchErasStart,
  searchErasSuccess,
} from "../slice/eraSlice";

const searchEras = (dispatch) => {
  dispatch(searchErasStart());
  try {
    api_aw
      .get("/public/eras")
      .then((response) => {
        if (response.status === 200) {
          dispatch(searchErasSuccess(response.data));
        }
      })
      .catch((error) => {
        dispatch(searchErasFailure());
        // toast.error(error.response.data);
      });
  } catch (error) {
    dispatch(searchErasFailure());
    // toast.error(error.response.data);
  }
};

export { searchEras };
