import { apiClient, isUnauthorizedError } from "@/shared/api";
import { useQuery } from "@tanstack/react-query";
import { SessionItem, UserMe } from "../model/types";
import { authKeys } from "./auth.keys";

export const useMe = () => {
  return useQuery<UserMe | null>({
    queryKey: authKeys.me,
    queryFn: async () => {
      try {
        const res = await apiClient.get<UserMe>("/auth/me");
        return ((res as any)?.data ?? res) as UserMe;
      } catch (error) {
        if (isUnauthorizedError(error)) {
          return null;
        }
        throw error;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};

export const useSessions = () => {
  return useQuery<SessionItem[]>({
    queryKey: authKeys.sessions,
    queryFn: async () => {
      const res = await apiClient.get<SessionItem[]>("/auth/sessions");
      return ((res as any)?.data ?? res) as SessionItem[];
    },
  });
};
