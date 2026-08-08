import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserMe } from "../model/types";
import { apiClient } from "@/shared/api";

export const userKeys = {
	me: ["user", "me"] as const,
};

export const useMe = () => {
	return useQuery<UserMe>({
		queryKey: userKeys.me,
		queryFn: () => apiClient.get("/users/me"),
	});
};

export const useChangeName = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: { name: string }) => apiClient.post("/profile/change-name", data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: userKeys.me });
		},
	});
};
