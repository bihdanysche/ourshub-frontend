import { apiClient } from "@/shared/api";
import { useQuery } from "@tanstack/react-query";
import {
  CrewDetail,
  CrewInvitePreview,
  CrewListItem,
  CrewMember,
  GetCrewMembersQueryDto,
  GetCrewsQueryDto,
  PaginatedResponse,
} from "../model/types";
import { crewKeys } from "./crew.keys";

export const useCrews = (params?: GetCrewsQueryDto) => {
  return useQuery<PaginatedResponse<CrewListItem>>({
    queryKey: crewKeys.list(params),
    queryFn: async () => {
      const res = await apiClient.get<PaginatedResponse<CrewListItem>>(
        "/crews",
        { params },
      );
      return (
        (res as unknown as { data?: PaginatedResponse<CrewListItem> })?.data ??
        (res as unknown as PaginatedResponse<CrewListItem>)
      );
    },
  });
};

export const useCrewInvitePreview = (inviteCode: string) => {
  return useQuery<CrewInvitePreview>({
    queryKey: crewKeys.invitePreview(inviteCode),
    queryFn: async () => {
      const res = await apiClient.get<CrewInvitePreview>(
        `/crews/invitations/${inviteCode}`,
      );
      return (
        (res as unknown as { data?: CrewInvitePreview })?.data ??
        (res as unknown as CrewInvitePreview)
      );
    },
    enabled: Boolean(inviteCode),
  });
};

export const useCrew = (crewId: number) => {
  return useQuery<CrewDetail>({
    queryKey: crewKeys.detail(crewId),
    queryFn: async () => {
      const res = await apiClient.get<CrewDetail>(`/crews/${crewId}`);
      return (
        (res as unknown as { data?: CrewDetail })?.data ??
        (res as unknown as CrewDetail)
      );
    },
    enabled: Boolean(crewId),
  });
};

export const useCrewMembers = (
  crewId: number,
  params?: GetCrewMembersQueryDto,
) => {
  return useQuery<PaginatedResponse<CrewMember>>({
    queryKey: crewKeys.members(crewId, params),
    queryFn: async () => {
      const res = await apiClient.get<PaginatedResponse<CrewMember>>(
        `/crews/${crewId}/members`,
        { params },
      );
      return (
        (res as unknown as { data?: PaginatedResponse<CrewMember> })?.data ??
        (res as unknown as PaginatedResponse<CrewMember>)
      );
    },
    enabled: Boolean(crewId),
  });
};
