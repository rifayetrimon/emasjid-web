"use client";

import { useEffect, useRef, useState } from "react";

type State<T> = { data: T | null; loading: boolean; error: unknown };

/**
 * Client-side data loader for the static export. A converted component that
 * used to `await` services in a Server Component now calls this in the
 * browser instead:
 *
 *   const { data, loading, error } = useCmsData(() => Promise.all([...]));
 *
 * It runs `loader` on mount, guards against setting state after unmount, and
 * re-runs when any value in `deps` changes (e.g. a route query param). The
 * loader reference itself is intentionally NOT a dependency — pass changing
 * inputs via `deps` so an inline arrow doesn't refetch on every render.
 */
export function useCmsData<T>(
  loader: () => Promise<T>,
  deps: unknown[] = [],
): State<T> {
  const [state, setState] = useState<State<T>>({
    data: null,
    loading: true,
    error: null,
  });
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  useEffect(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    loaderRef
      .current()
      .then((data) => {
        if (alive) setState({ data, loading: false, error: null });
      })
      .catch((error) => {
        if (alive) setState({ data: null, loading: false, error });
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
