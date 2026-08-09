export interface UserMe {
  id: number;
  username: string | null;
  name: string;
  avatar: string | null;
}

export interface EditProfileDto {
  name?: string;
  username?: string;
}

export interface ApiResponseOk {
  ok: boolean;
}
