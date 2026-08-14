import {
  GetExpenseRequestsQueryDto,
  GetSplitHistoryQueryDto,
  GetSplitsQueryDto,
} from "../model/types";

export const splitKeys = {
  all: ["splits"] as const,
  lists: () => [...splitKeys.all, "list"] as const,
  list: (crewId: number, query?: GetSplitsQueryDto) =>
    [...splitKeys.lists(), crewId, query ?? {}] as const,
  details: () => [...splitKeys.all, "detail"] as const,
  detail: (id: number) => [...splitKeys.details(), id] as const,
  histories: () => [...splitKeys.all, "history"] as const,
  history: (splitId: number, query?: GetSplitHistoryQueryDto) =>
    [...splitKeys.histories(), splitId, query ?? {}] as const,
  expenseRequests: () => [...splitKeys.all, "requests"] as const,
  expenseRequestList: (splitId: number, query?: GetExpenseRequestsQueryDto) =>
    [...splitKeys.expenseRequests(), splitId, query ?? {}] as const,
};
