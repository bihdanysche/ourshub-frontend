"use client";

import { ChevronLeft, ChevronRight } from "@gravity-ui/icons";
import { Button } from "@heroui/react";
import { useTranslation } from "react-i18next";

interface CrewsPaginationProps {
  page: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
}

export function CrewsPagination({
  page,
  totalPages,
  hasPrevPage,
  hasNextPage,
  onPageChange,
}: CrewsPaginationProps) {
  const { t } = useTranslation();

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 pt-6">
      <Button
        size="sm"
        variant="outline"
        isDisabled={!hasPrevPage}
        onPress={() => onPageChange(page - 1)}
        className="flex items-center gap-1.5 cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>{t("home.pagination.prev")}</span>
      </Button>

      <span className="text-sm font-medium text-foreground/70 px-2">
        {t("home.pagination.page_info", { current: page, total: totalPages })}
      </span>

      <Button
        size="sm"
        variant="outline"
        isDisabled={!hasNextPage}
        onPress={() => onPageChange(page + 1)}
        className="flex items-center gap-1.5 cursor-pointer"
      >
        <span>{t("home.pagination.next")}</span>
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
