export interface SplitUser {
  id: number;
  name: string;
  alias: string | null;
  username: string | null;
  avatar: string | null;
}

export interface SplitItem {
  id: number;
  title: string;
  desc?: string;
  archived: boolean;
  createdAt: string;
  authors: SplitUser[];
  totalPaid: number;
  totalMustPay: number;
}

export interface SplitMember {
  user: SplitUser;
  paid: number;
  mustPay: number;
}

export interface SplitExpense {
  id: number;
  title: string;
  desc?: string;
  spender: SplitUser;
  members: SplitMember[];
}

export interface SplitDetail {
  id: number;
  title: string;
  desc?: string;
  archived: boolean;
  createdAt: string;
  expenses: SplitExpense[];
}

export type ExpenseHistoryType = "PAY" | "INC";

export interface ExpensePayHistoryItem {
  id: number;
  splitId: number;
  expenseId: number;
  expenseTitle: string;
  splitTitle: string;
  user: SplitUser;
  amount: number;
  type: ExpenseHistoryType;
  msg?: string;
  createdAt: string;
}

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

export interface GetSplitsQueryDto {
  page?: number;
  limit?: number;
  isArchived?: boolean;
}

export interface GetSplitHistoryQueryDto {
  page?: number;
  limit?: number;
  q?: string;
  userId?: number;
}

export interface CreateSplitMemberDto {
  user: number;
  paid: number;
  mustPay: number;
}

export interface CreateSplitExpenseDto {
  title: string;
  desc?: string;
  spender: number;
  members: CreateSplitMemberDto[];
}

export interface CreateSplitDto {
  title: string;
  desc?: string;
  expenses: CreateSplitExpenseDto[];
}

export interface UpdateSplitExpenseDto {
  id: number;
  title?: string;
  desc?: string;
}

export interface UpdateSplitDto {
  title?: string;
  desc?: string;
  expenses?: UpdateSplitExpenseDto[];
}

export interface PayOffItemDto {
  user: number;
  amount: number;
  msg?: string;
}

export interface IncreaseItemDto {
  user: number;
  amount: number;
  msg?: string;
}

export interface AddExpenseDto {
  expenses: CreateSplitExpenseDto[];
}

export interface AddExpenseMembersDto {
  members: CreateSplitMemberDto[];
}

export interface RemoveExpenseMembersDto {
  userIds: number[];
}
