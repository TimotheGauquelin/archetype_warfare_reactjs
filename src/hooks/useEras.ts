import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEras } from "../redux/slice/eraSlice";
import type { RootState, AppDispatch } from "../redux/store";

export const useEras = () => {
  const dispatch = useDispatch<AppDispatch>();
  const eras = useSelector((state: RootState) => state.era.eras);
  const isLoading = useSelector((state: RootState) => state.era.isLoading);

  useEffect(() => {
    if (eras.length === 0 && !isLoading) {
      dispatch(fetchEras());
    }
  }, [eras.length, isLoading, dispatch]);

  return { eras, isLoading };
};
