import { apiClient } from "@/shared/api";
import { useQuery } from "@tanstack/react-query";
import {
  ExpensePayHistoryItem,
  ExpenseRequestItem,
  GetExpenseRequestsQueryDto,
  GetSplitHistoryQueryDto,
  GetSplitsQueryDto,
  PaginatedResponse,
  SplitDetail,
  SplitItem,
} from "../model/types";
import { splitKeys } from "./split.keys";

export const useSplits = (crewId: number, query?: GetSplitsQueryDto) => {
  return useQuery<PaginatedResponse<SplitItem>>({
    queryKey: splitKeys.list(crewId, query),
    queryFn: async () => {
      const res = await apiClient.get<PaginatedResponse<SplitItem>>(
        `/splits/all/${crewId}`,
        { params: query },
      );
      return (
        (res as unknown as { data?: PaginatedResponse<SplitItem> })?.data ??
        (res as unknown as PaginatedResponse<SplitItem>)
      );
    },
    enabled: Boolean(crewId) && !isNaN(crewId),
  });
};

export const useSplit = (splitId: number) => {
  return useQuery<SplitDetail>({
    queryKey: splitKeys.detail(splitId),
    queryFn: async () => {
      const res = await apiClient.get<SplitDetail>(`/splits/${splitId}`);
      return (
        (res as unknown as { data?: SplitDetail })?.data ??
        (res as unknown as SplitDetail)
      );
    },
    enabled: Boolean(splitId) && !isNaN(splitId),
  });
};

export const useSplitHistory = (
  splitId: number,
  query?: GetSplitHistoryQueryDto,
) => {
  return useQuery<PaginatedResponse<ExpensePayHistoryItem>>({
    queryKey: splitKeys.history(splitId, query),
    queryFn: async () => {
      const res = await apiClient.get<PaginatedResponse<ExpensePayHistoryItem>>(
        `/splits/${splitId}/history`,
        { params: query },
      );
      return (
        (res as unknown as {
          data?: PaginatedResponse<ExpensePayHistoryItem>;
        })?.data ?? (res as unknown as PaginatedResponse<ExpensePayHistoryItem>)
      );
    },
    enabled: Boolean(splitId) && !isNaN(splitId),
  });
};

export const useExpenseRequests = (
  splitId: number,
  query?: GetExpenseRequestsQueryDto,
) => {
  return useQuery<PaginatedResponse<ExpenseRequestItem>>({
    queryKey: splitKeys.expenseRequestList(splitId, query),
    queryFn: async () => {
      const res = await apiClient.get<PaginatedResponse<ExpenseRequestItem>>(
        `/splits/${splitId}/expense-requests`,
        { params: query },
      );
      return (
        (res as unknown as {
          data?: PaginatedResponse<ExpenseRequestItem>;
        })?.data ?? (res as unknown as PaginatedResponse<ExpenseRequestItem>)
      );
    },
    enabled: Boolean(splitId) && !isNaN(splitId),
  });
};
