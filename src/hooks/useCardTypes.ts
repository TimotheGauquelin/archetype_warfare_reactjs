import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCardTypes } from "../redux/slice/cardTypeSlice";
import type { RootState, AppDispatch } from "../redux/store";

export const useCardTypes = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cardTypes = useSelector((state: RootState) => state.cardType.cardTypes);
  const isLoading = useSelector((state: RootState) => state.cardType.isLoading);

  useEffect(() => {
    if (cardTypes.length === 0 && !isLoading) {
      dispatch(fetchCardTypes());
    }
  }, [cardTypes.length, isLoading, dispatch]);

  return { cardTypes, isLoading };
};
