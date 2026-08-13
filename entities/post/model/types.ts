export interface PostAuthor {
  id: number;
  username: string | null;
  name: string;
  alias: string | null;
  avatar: string | null;
}

export interface PostAttachment {
  id: number;
  url?: string;
  key?: string;
  type: "IMAGE" | "VIDEO" | "AUDIO" | "FILE" | string;
  name?: string;
  size?: number;
}

export interface PostItem {
  id: number;
  content: string;
  youIsAuthor: boolean;
  author: PostAuthor;
  attachments?: PostAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface GetPostsQueryDto {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedPostsResponse {
  items: PostItem[];
  meta: PaginationMeta;
}

export interface CreatePostDto {
  content: string;
}

export interface UpdatePostDto {
  content: string;
}
