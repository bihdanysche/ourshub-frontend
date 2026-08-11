import { apiClient } from "@/shared/api";
import { useInfiniteQuery } from "@tanstack/react-query";
import { GetPostsQueryDto, PaginatedPostsResponse } from "../model/types";
import { postKeys } from "./post.keys";

export const usePosts = (
  crewId: number,
  params?: Omit<GetPostsQueryDto, "page">,
) => {
  return useInfiniteQuery<PaginatedPostsResponse>({
    queryKey: postKeys.list(crewId),
    queryFn: async ({ pageParam = 1 }) => {
      const res = await apiClient.get<PaginatedPostsResponse>(
        `/posts/${crewId}`,
        {
          params: {
            ...params,
            page: pageParam,
            limit: params?.limit ?? 20,
          },
        },
      );
      return (
        (res as unknown as { data?: PaginatedPostsResponse })?.data ??
        (res as unknown as PaginatedPostsResponse)
      );
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.hasNextPage) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    },
    enabled: Boolean(crewId) && !isNaN(crewId),
  });
};
