import { GetCrewMembersQueryDto, GetCrewsQueryDto } from "../model/types";

export const crewKeys = {
  all: ["crews"] as const,
  lists: () => [...crewKeys.all, "list"] as const,
  list: (params?: GetCrewsQueryDto) =>
    [...crewKeys.lists(), params ?? {}] as const,
  details: () => [...crewKeys.all, "detail"] as const,
  detail: (id: number) => [...crewKeys.details(), id] as const,
  invitations: () => [...crewKeys.all, "invitation"] as const,
  invitePreview: (code: string) =>
    [...crewKeys.invitations(), "preview", code] as const,
  membersAll: () => [...crewKeys.all, "members"] as const,
  members: (crewId: number, params?: GetCrewMembersQueryDto) =>
    [...crewKeys.membersAll(), crewId, params ?? {}] as const,
};
