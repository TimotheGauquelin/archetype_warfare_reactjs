import api_aw from "../../api/api_aw";
import {
  searchArchetypeFailure,
  searchArchetypeStart,
  searchArchetypeSuccess,
} from "../slice/archetypeSlice";

const searchArchetypes = (dispatch) => {
  dispatch(searchArchetypeStart());
  {try 
    api_aw
      .get("/public/authenticate")
      .then((response) => {
        dispatch(searchArchetypeSuccess(response.data));
      })
      .catch((error) => {
        dispatch(searchArchetypeFailure());
        // toast.error(error.response.data);
      });
  } catch (error) {
    dispatch(searchArchetypeFailure());
    // toast.error(error.response.data);
  }
};

export { searchArchetypes };
