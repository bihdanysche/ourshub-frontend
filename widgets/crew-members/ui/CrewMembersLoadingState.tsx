"use client";

import { Skeleton } from "@heroui/react";

export function CrewMembersLoadingState() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-border/40 bg-surface/30 shadow-xs"
        >
          <div className="flex items-center gap-3.5">
            <Skeleton className="w-11 h-11 rounded-2xl" />
            <div className="flex flex-col gap-1.5">
              <Skeleton className="w-32 h-4 rounded-md" />
              <Skeleton className="w-20 h-3 rounded-md" />
            </div>
          </div>
          <Skeleton className="w-8 h-8 rounded-xl" />
        </div>
      ))}
    </div>
  );
}
