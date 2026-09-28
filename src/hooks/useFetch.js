import { useState, useEffect, useCallback, useRef } from "react";

/**
 * useFetch
 * ---------
 * A reusable custom hook that fetches JSON data from a given URL and
 * exposes the standard three-state pattern every data-fetching component
 * needs: `data`, `loading`, and `error`.
 *
 * Why it's built this way:
 * - useState        -> holds the three pieces of state the UI needs.
 * - useCallback      -> keeps `fetchData` referentially stable so it can
 *                       be safely listed as a useEffect dependency AND
 *                       exposed as a manual `refetch()` function.
 * - useEffect        -> triggers the fetch whenever the URL changes.
 * - useRef (AbortController) -> cancels an in-flight request if the URL
 *                       changes again or the component unmounts before
 *                       the response arrives. Without this, a slow,
 *                       stale request can resolve *after* a newer one
 *                       and overwrite fresh data with old data (a race
 *                       condition), or try to update state on an
 *                       unmounted component (a common React warning/leak).
 *
 * @param {string} url - The endpoint to fetch JSON from.
 * @returns {{
 *   data: any,
 *   loading: boolean,
 *   error: string | null,
 *   refetch: () => void
 * }}
 */
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tracks the controller for the *current* in-flight request so we can
  // cancel it if a new fetch starts (new URL, or manual refetch) before
  // the old one finishes.
  const abortControllerRef = useRef(null);

  const fetchData = useCallback(async () => {
    // Basic guard: don't attempt a request for an empty/invalid URL.
    if (!url || typeof url !== "string") {
      setError("A valid URL string is required.");
      setLoading(false);
      setData(null);
      return;
    }

    // Cancel any previous request that might still be in flight.
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, { signal: controller.signal });

      if (!response.ok) {
        // fetch() only rejects on network failure, not on HTTP error
        // codes (404, 500, etc.), so we check response.ok explicitly.
        throw new Error(`Request failed with status ${response.status}`);
      }

      const json = await response.json();
      setData(json);
    } catch (err) {
      // Ignore the error thrown when we intentionally abort a stale
      // request — that's expected behavior, not a real failure.
      if (err.name === "AbortError") return;

      setError(err.message || "Something went wrong while fetching data.");
      setData(null);
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [url]);

  useEffect(() => {
    fetchData();

    // Cleanup: abort the request if the component unmounts or the URL
    // changes again before this request finishes.
    return () => {
      abortControllerRef.current?.abort();
    };
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export default useFetch;
