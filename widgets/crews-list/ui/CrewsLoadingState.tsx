"use client";

import { Card, Skeleton } from "@heroui/react";

export function CrewsLoadingState() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card
          key={index}
          className="flex flex-col justify-between border border-border/40 bg-surface/30 rounded-2xl p-5 shadow-xs h-[170px]"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <Skeleton className="w-14 h-14 rounded-2xl" />
              <Skeleton className="w-20 h-6 rounded-full" />
            </div>

            <div className="flex flex-col gap-2">
              <Skeleton className="w-36 h-5 rounded-md" />
              <Skeleton className="w-24 h-4 rounded-md" />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 mt-3 border-t border-border/30">
            <Skeleton className="w-8 h-3 rounded-md" />
          </div>
        </Card>
      ))}
    </div>
  );
}
