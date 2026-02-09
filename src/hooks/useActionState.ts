import { useState, useTransition, useCallback } from "react";

export function useActionState<State>(
  action: (prevState: State, formData: FormData) => State | Promise<State>,
  initialState: State
): [State, (formData: FormData) => void, boolean] {
  const [state, setState] = useState<State>(initialState);
  const [isPending, startTransition] = useTransition();

  const formAction = useCallback(
    (formData: FormData) => {
      startTransition(() => {
        Promise.resolve(action(state, formData)).then(setState);
      });
    },
    [action, state]
  );

  return [state, formAction, isPending];
}
