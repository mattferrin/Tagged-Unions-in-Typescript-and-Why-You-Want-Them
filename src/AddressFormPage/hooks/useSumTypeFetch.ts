import { useState, useEffect } from "react";

/**
 * fetch result can only be 1 of these at a time
 */
type Loading<T> =
  | { kind: "uncalled" }
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "data"; data: T };

/**
 * pretend fetch with 50/50 chance of "error" or "data" result (a react hook)
 * @param data
 */
export function useSumTypeFetch<T>(data: T): Loading<T> {
  // fetch is "uncalled" initially, treated as "loading" but not technically
  const [fetchStatus, setFetchStatus] = useState<Loading<T>>({
    kind: "uncalled",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      // set result of pretend fetch to randomly be "data" or "error"
      setFetchStatus(
        Math.random() >= 0.5
          ? { kind: "data", data }
          : { kind: "error", message: "loading failed" }
      );
    }, 1000);
    return () => {
      // avoid memory leak
      clearTimeout(timer);
    };
    // data would cause an infinite reload loop (react-hooks/exhaustive-deps)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // result of fetch
  return fetchStatus;
}
