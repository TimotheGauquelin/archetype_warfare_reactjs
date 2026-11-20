import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchArchetypesNames } from "../redux/slice/archetypeSlice";
import type { RootState, AppDispatch } from "../redux/store";
import type { Archetype } from "../types";

export const useArchetypesName = () => {
  const dispatch = useDispatch<AppDispatch>();
  const archetypes = useSelector(
    (state: RootState) =>
      state.archetype.archetypes.sort((a: Archetype, b: Archetype) =>
        a.name.localeCompare(b.name)
      )
  );
  const isLoading = useSelector((state: RootState) => state.archetype.isLoading);

  useEffect(() => {
    if (archetypes.length === 0 && !isLoading) {
      dispatch(fetchArchetypesNames());
    }
  }, [archetypes.length, isLoading, dispatch]);

  return { archetypes, isLoading };
};
