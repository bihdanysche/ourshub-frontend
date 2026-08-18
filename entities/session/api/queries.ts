import { apiClient } from "@/shared/api";
import { useQuery } from "@tanstack/react-query";
import { Session } from "../model/types";
import { sessionKeys } from "./session.keys";

export const useSessions = () => {
  return useQuery<Session[]>({
    queryKey: sessionKeys.list(),
    queryFn: async () => {
      const res = await apiClient.get<Session[]>("/auth/sessions");
      return (
        (res as unknown as { data?: Session[] })?.data ??
        (res as unknown as Session[])
      );
    },
  });
};
