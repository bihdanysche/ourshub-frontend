import { apiClient } from "@/shared/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ApiResponseOk,
  CreateCrewDto,
  JoinCrewDto,
  JoinCrewResponse,
  UpdateCrewDto,
  UpdateMemberAliasDto,
} from "../model/types";
import { crewKeys } from "./crew.keys";

export const useCreateCrew = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCrewDto) =>
      apiClient.post<ApiResponseOk>("/crews", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: crewKeys.lists() });
    },
  });
};

export const useUpdateCrew = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCrewDto }) =>
      apiClient.patch<ApiResponseOk>(`/crews/${id}`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: crewKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: crewKeys.lists() });
    },
  });
};

export const useJoinCrew = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      invCode,
      ...data
    }: JoinCrewDto & { invCode: string }) => {
      const res = await apiClient.post<JoinCrewResponse>(
        `/crews/invitations/${invCode}/join`,
        data,
      );
      return (
        (res as unknown as { data?: JoinCrewResponse })?.data ??
        (res as unknown as JoinCrewResponse)
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: crewKeys.lists() });
    },
  });
};

export const useUpdateMemberAlias = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      crewId,
      memberId,
      data,
    }: {
      crewId: number;
      memberId: number;
      data: UpdateMemberAliasDto;
    }) =>
      apiClient.put<ApiResponseOk>(
        `/crews/${crewId}/members/${memberId}/alias`,
        data,
      ),
    onSuccess: (_, { crewId }) => {
      queryClient.invalidateQueries({ queryKey: crewKeys.members(crewId) });
      queryClient.invalidateQueries({ queryKey: crewKeys.detail(crewId) });
    },
  });
};

export const useRemoveMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      crewId,
      memberId,
    }: {
      crewId: number;
      memberId: number;
    }) =>
      apiClient.delete<ApiResponseOk>(
        `/crews/${crewId}/members/${memberId}`,
      ),
    onSuccess: (_, { crewId }) => {
      queryClient.invalidateQueries({ queryKey: crewKeys.members(crewId) });
      queryClient.invalidateQueries({ queryKey: crewKeys.detail(crewId) });
      queryClient.invalidateQueries({ queryKey: crewKeys.lists() });
    },
  });
};

export const useDeleteCrew = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (crewId: number) =>
      apiClient.delete<ApiResponseOk>(`/crews/${crewId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: crewKeys.all });
    },
  });
};
