import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import i18n from "../config/i18n/i18n";
import { toast } from "@/shared/ui/sonner";

type RetryRequestConfig = InternalAxiosRequestConfig & {
	_retry?: boolean;
};

type ApiError = {
	error_code?: string;
};

export const apiClient = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
});

const refreshClient = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
});

let isRefreshing = false;

let failedQueue: Array<{
	resolve: () => void;
	reject: (error: unknown) => void;
}> = [];

function processQueue(error?: unknown) {
	failedQueue.forEach(({ resolve, reject }) => {
		if (error) {
			reject(error);
		} else {
			resolve();
		}
	});

	failedQueue = [];
}

apiClient.interceptors.response.use(
	response => response.data,

	async (error: AxiosError<ApiError>) => {
		const originalRequest = error.config as RetryRequestConfig;

		if (!originalRequest) {
			return Promise.reject(error);
		}

		const errorCode = error.response?.data?.error_code;

		if (
			error.response?.status !== 401 ||
			errorCode !== "ACCESS_TOKEN_EXPIRED" ||
			originalRequest._retry
		) {
			return Promise.reject(error);
		}

		originalRequest._retry = true;

		if (isRefreshing) {
			return new Promise<void>((resolve, reject) => {
				failedQueue.push({
					resolve,
					reject,
				});
			}).then(() => apiClient(originalRequest));
		}

		isRefreshing = true;

		try {
			await refreshClient.post("/auth/refresh");

			processQueue();

			return apiClient(originalRequest);
		} catch (refreshError) {
			processQueue(refreshError);

			return Promise.reject(refreshError);
		} finally {
			isRefreshing = false;
		}
	}
);

export function getErrorMessage(error: unknown): string | null {
	if (error && typeof error === "object" && "response" in error) {
		const response = (error as { response?: { data?: unknown } }).response;
		if (response?.data && typeof response.data === "object" && "error_code" in response.data) {
			return (response.data as { error_code: string }).error_code;
		}
	}
	return null;
}

export const toastApiError = (error: unknown) => {
	const code = getErrorMessage(error);
	const t = i18n.t;
	toast.error(t(i18n.exists(`api_errors.${code}`) ? `api_errors.${code}` : `api_errors.UNKNOWN`));
};
