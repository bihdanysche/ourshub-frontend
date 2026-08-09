export interface UserMe {
  id: number;
  username: string | null;
  name: string;
  avatar: string | null;
}

export interface SessionItem {
  id: number;
  ip: string;
  agent: string;
  createdAt: string;
  lastUsedAt: string;
  expiresAt: string;
  isCurrent: boolean;
}

export interface ApiResponseOk {
  ok: boolean;
}
