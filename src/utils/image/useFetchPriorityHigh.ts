import { useCallback } from "react";

/**
 * React 18 ignore souvent fetchpriority en JSX.
 * Pose l’attribut DOM natif requis par Lighthouse (LCP).
 */
export function useFetchPriorityHigh(enabled: boolean) {
  return useCallback(
    (node: HTMLImageElement | null) => {
      if (!node) return;
      if (enabled) {
        node.setAttribute("fetchpriority", "high");
      } else {
        node.removeAttribute("fetchpriority");
      }
    },
    [enabled]
  );
}
