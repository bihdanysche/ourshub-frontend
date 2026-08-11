import { apiClient } from "@/shared/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AddExpenseDto,
  AddExpenseMembersDto,
  CreateSplitDto,
  IncreaseItemDto,
  PayOffItemDto,
  RemoveExpenseMembersDto,
  UpdateSplitDto,
} from "../model/types";
import { splitKeys } from "./split.keys";

export const useCreateSplit = (crewId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSplitDto) => {
      return apiClient.post<{ ok: true }>(`/splits/create/${crewId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: splitKeys.all });
    },
  });
};

export const useUpdateSplit = (splitId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateSplitDto) => {
      return apiClient.patch<{ ok: true }>(`/splits/${splitId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: splitKeys.detail(splitId) });
      queryClient.invalidateQueries({ queryKey: splitKeys.lists() });
    },
  });
};

export const useArchiveSplit = (splitId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return apiClient.delete<{ ok: true }>(`/splits/${splitId}/archive`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: splitKeys.all });
    },
  });
};

export const usePayOffExpenseMember = (
  splitId: number,
  expenseId: number,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (items: PayOffItemDto[]) => {
      return apiClient.put<{ ok: true }>(
        `/splits/${splitId}/${expenseId}/pay-off`,
        items,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: splitKeys.detail(splitId) });
      queryClient.invalidateQueries({ queryKey: splitKeys.histories() });
      queryClient.invalidateQueries({ queryKey: splitKeys.lists() });
    },
  });
};

export const useIncreaseDebtExpenseMember = (
  splitId: number,
  expenseId: number,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (items: IncreaseItemDto[]) => {
      return apiClient.put<{ ok: true }>(
        `/splits/${splitId}/${expenseId}/increase`,
        items,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: splitKeys.detail(splitId) });
      queryClient.invalidateQueries({ queryKey: splitKeys.histories() });
      queryClient.invalidateQueries({ queryKey: splitKeys.lists() });
    },
  });
};

export const useAddExpense = (splitId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddExpenseDto) => {
      return apiClient.post<{ ok: true }>(`/splits/${splitId}/add-expense`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: splitKeys.detail(splitId) });
      queryClient.invalidateQueries({ queryKey: splitKeys.lists() });
    },
  });
};

export const useAddMemberToExpense = (
  splitId: number,
  expenseId: number,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddExpenseMembersDto) => {
      return apiClient.post<{ ok: true }>(
        `/splits/${splitId}/${expenseId}/add-members`,
        data,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: splitKeys.detail(splitId) });
      queryClient.invalidateQueries({ queryKey: splitKeys.lists() });
    },
  });
};

export const useDeleteExpense = (splitId: number, expenseId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return apiClient.delete<{ ok: true }>(`/splits/${splitId}/${expenseId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: splitKeys.detail(splitId) });
      queryClient.invalidateQueries({ queryKey: splitKeys.lists() });
    },
  });
};

export const useRemoveMembersFromExpense = (
  splitId: number,
  expenseId: number,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RemoveExpenseMembersDto) => {
      return apiClient.delete<{ ok: true }>(
        `/splits/${splitId}/${expenseId}/remove-members`,
        { data },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: splitKeys.detail(splitId) });
      queryClient.invalidateQueries({ queryKey: splitKeys.lists() });
    },
  });
};
