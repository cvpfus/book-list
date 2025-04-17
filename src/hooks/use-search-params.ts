import { useCallback } from "react";
import {
  useRouter,
  useSearchParams as next_useSearchParams,
} from "next/navigation";

// https://github.com/vercel/next.js/discussions/56399#discussioncomment-11134427
export function useSearchParams() {
  const router = useRouter();
  const searchParams = next_useSearchParams();

  const setSearchParams = useCallback(
    (newSearchParams: URLSearchParams, options?: { replace?: boolean }) => {
      if (options?.replace) {
        window.history.replaceState({}, "", `?${newSearchParams.toString()}`);
      } else {
        window.history.pushState({}, "", `?${newSearchParams.toString()}`);
      }

      setTimeout(() => {
        router.refresh();
      }, 0);
    },
    [router],
  );

  return { searchParams, setSearchParams };
}
