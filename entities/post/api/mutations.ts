import { apiClient } from "@/shared/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreatePostDto, UpdatePostDto } from "../model/types";
import { postKeys } from "./post.keys";

export const useCreatePost = (crewId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePostDto) => {
      const formData = new FormData();
      formData.append("content", data.content.trim());

      return apiClient.post<{ ok: true }>(`/posts/${crewId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.list(crewId) });
    },
  });
};

export const useEditPost = (crewId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      postId,
      data,
    }: {
      postId: number;
      data: UpdatePostDto;
    }) => {
      const formData = new FormData();
      formData.append("content", data.content.trim());

      return apiClient.patch<{ ok: true }>(
        `/posts/${crewId}/${postId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.list(crewId) });
    },
  });
};

export const useDeletePost = (crewId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: number) => {
      return apiClient.delete<{ ok: true }>(`/posts/${crewId}/${postId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.list(crewId) });
    },
  });
};

export const useCreatePostMutation = useCreatePost;
export const useEditPostMutation = useEditPost;
export const useDeletePostMutation = useDeletePost;
