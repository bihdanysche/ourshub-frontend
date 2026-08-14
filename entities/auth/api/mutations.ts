import { apiClient } from "@/shared/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ApiResponseOk, EditProfileDto, UserMe } from "../model/types";
import { authKeys } from "./auth.keys";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => apiClient.post<ApiResponseOk>("/auth/logout"),
    onSuccess: () => {
      queryClient.setQueryData(authKeys.me, null);
      router.replace("/");
    },
  });
};

export const useEditProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EditProfileDto) => apiClient.patch<UserMe>("/me", data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(authKeys.me, updatedUser);
    },
  });
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      return apiClient.post<ApiResponseOk>("/auth/me/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.me });
    },
  });
};

export const useDeleteAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiClient.delete<ApiResponseOk>("/auth/me/avatar"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.me });
    },
  });
};
