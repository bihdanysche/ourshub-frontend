"use client";

import { Card, Skeleton } from "@heroui/react";

export function CrewLoadingState() {
  return (
    <div className="w-(--page-width) max-w-full flex flex-col px-4 sm:px-6 md:px-0 py-6 gap-6">
      <div className="flex flex-col rounded-3xl overflow-hidden border border-border/40 bg-surface/30 shadow-xs">
        <Skeleton className="h-44 sm:h-56 md:h-64 w-full" />
        <div className="px-5 sm:px-8 pb-6 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-4">
            <div className="flex items-end gap-4">
              <Skeleton className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl ring-4 ring-background" />
              <div className="flex flex-col gap-2 pb-1">
                <Skeleton className="w-48 h-7 rounded-lg" />
                <Skeleton className="w-28 h-4 rounded-md" />
              </div>
            </div>
            <div className="flex items-center gap-2 pb-1">
              <Skeleton className="w-28 h-9 rounded-xl" />
              <Skeleton className="w-9 h-9 rounded-xl" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 border-b border-border/40 pb-3">
        <Skeleton className="w-20 h-8 rounded-lg" />
        <Skeleton className="w-20 h-8 rounded-lg" />
        <Skeleton className="w-24 h-8 rounded-lg" />
      </div>

      <Card className="border border-border/40 bg-surface/30 rounded-2xl p-12 flex flex-col items-center justify-center gap-4 min-h-[260px]">
        <Skeleton className="w-16 h-16 rounded-2xl" />
        <Skeleton className="w-48 h-6 rounded-lg" />
        <Skeleton className="w-64 h-4 rounded-md" />
      </Card>
    </div>
  );
}
