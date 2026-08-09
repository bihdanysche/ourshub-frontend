import { getApiErrorCode } from "@/shared/api";
import i18n from "@/shared/config/i18n/i18n";
import { TriangleExclamationFill } from "@gravity-ui/icons";
import { toast } from "@heroui/react";

export function toastApiError(error: unknown) {
  const code = getApiErrorCode(error);
  const translationKey =
    code && i18n.exists(`api_errors.${code}`)
      ? `api_errors.${code}`
      : "api_errors.UNKNOWN_ERROR";

  toast.danger(i18n.t("common.error"), {
    description: i18n.t(translationKey),
    indicator: <TriangleExclamationFill />,
  });
}
