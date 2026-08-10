export type CrewRole = "OWNER" | "MEMBER";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface CrewListItem {
  id: number;
  title: string;
  avatar: string | null;
  membersCount: number;
  role: CrewRole;
}

export interface CrewDetail {
  id: number;
  title: string;
  avatar: string | null;
  cover: string | null;
  membersCount: number;
  role: CrewRole;
  inviteCode: string | null;
  createdAt: string;
}

export interface CrewInvitePreview {
  id: number;
  title: string;
  avatar: string | null;
  cover: string | null;
  membersCount: number;
}

export interface CrewMember {
  id: number;
  userId: number;
  name: string;
  username: string | null;
  avatar: string | null;
  role: CrewRole;
  alias: string | null;
  joinedAt: string;
}

export interface GetCrewsQueryDto {
  page?: number;
  limit?: number;
}

export interface GetCrewMembersQueryDto {
  page?: number;
  limit?: number;
}

export interface CreateCrewDto {
  title: string;
}

export interface UpdateCrewDto {
  title: string;
}

export interface JoinCrewDto {
  alias?: string;
}

export interface JoinCrewResponse {
  ok: boolean;
  crewId: number;
}

export interface UpdateMemberAliasDto {
  alias: string | null;
}

export interface ApiResponseOk {
  ok: boolean;
}
