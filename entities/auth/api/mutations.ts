import { apiClient } from "@/shared/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ApiResponseOk } from "../model/types";
import { authKeys } from "./auth.keys";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => apiClient.post<ApiResponseOk>("/auth/logout"),
    onSuccess: () => {
      // Immediately set user to null in cache without deleting the query
      queryClient.setQueryData(authKeys.me, null);
      queryClient.removeQueries({ queryKey: authKeys.sessions });
      router.replace("/");
    },
  });
};

export const useShutdownSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: number }) =>
      apiClient.post<ApiResponseOk>(`/auth/sessions/shutdown/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.sessions });
    },
  });
};

export const useShutdownAllSessions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiClient.post<ApiResponseOk>("/auth/sessions/shutdown-all"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.sessions });
    },
  });
};
