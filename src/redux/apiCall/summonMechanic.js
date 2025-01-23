import api_aw from "../../api/api_aw";
import {
  searchSummonMechanicsFailure,
  searchSummonMechanicsStart,
  searchSummonMechanicsSuccess,
} from "../slice/summonMechanicSlice";

const searchSummonMechanics = (dispatch) => {
  dispatch(searchSummonMechanicsStart());
  try {
    api_aw
      .get("/public/summonMechanics")
      .then((response) => {
        if (response.status === 200) {
          dispatch(searchSummonMechanicsSuccess(response.data));
        }
      })
      .catch((error) => {
        dispatch(searchSummonMechanicsFailure());
        // toast.error(error.response.data);
      });
  } catch (error) {
    dispatch(searchSummonMechanicsFailure());
    // toast.error(error.response.data);
  }
};

export { searchSummonMechanics };
