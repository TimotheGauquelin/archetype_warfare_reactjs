import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAttributes } from "../redux/slice/attributeSlice";
import type { RootState, AppDispatch } from "../redux/store";

export const useAttributes = () => {
  const dispatch = useDispatch<AppDispatch>();
  const attributes = useSelector((state: RootState) => state.attribute.attributes);
  const isLoading = useSelector((state: RootState) => state.attribute.isLoading);

  useEffect(() => {
    if (attributes.length === 0 && !isLoading) {
      dispatch(fetchAttributes());
    }
  }, [attributes.length, isLoading, dispatch]);

  return { attributes, isLoading };
};
