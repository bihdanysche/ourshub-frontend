import { apiClient } from "@/shared/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiResponseOk } from "../model/types";
import { sessionKeys } from "./session.keys";

export const useShutdownSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      apiClient.post<ApiResponseOk>(`/auth/sessions/shutdown/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });
    },
  });
};

export const useShutdownAllSessions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      apiClient.post<ApiResponseOk>("/auth/sessions/shutdown-all"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });
    },
  });
};
