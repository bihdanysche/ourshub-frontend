export interface Session {
  id: number;
  ip: string;
  agent: string;
  location: string | null;
  createdAt: string;
  lastUsedAt: string;
  expiresAt: string;
  isCurrent: boolean;
}

export interface ApiResponseOk {
  ok: boolean;
}
