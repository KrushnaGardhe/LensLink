import { useInfiniteQuery } from "@tanstack/react-query";
import {CONFIG} from "../config"
const ACCESS_KEY =CONFIG.UNSPLASH_ACCESS_KEY;

export const useUnsplash = () => {
  return useInfiniteQuery({
    queryKey: ["unsplash-images"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetch(
        `https://api.unsplash.com/photos?page=${pageParam}&per_page=15&client_id=${ACCESS_KEY}`
      );

      if (!response.ok) {
        let errorMessage = "Unsplash API limit reached or network error";
        try {
          const errorData = await response.json();
          console.error("Unsplash API Error:", errorData);
          errorMessage = errorData?.errors?.[0] || errorMessage;
        } catch {
          
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 0 ? undefined : allPages.length + 1;
    },
    initialPageParam: 1,
    retry: 2,
    staleTime: 1000 * 60 * 10, 
  });
};
