"use client";

import { Skeleton } from "@heroui/react";

export function SessionsSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="border-b border-border/40 pb-4">
        <Skeleton className="w-40 h-7 rounded-lg" />
        <Skeleton className="w-72 h-4 rounded-md mt-2" />
      </div>

      <div className="flex flex-col gap-3">
        <Skeleton className="w-36 h-5 rounded-md" />
        <Skeleton className="w-full h-24 rounded-xl" />
      </div>

      <div className="flex flex-col gap-3 mt-2">
        <div className="flex justify-between items-center">
          <Skeleton className="w-32 h-5 rounded-md" />
          <Skeleton className="w-28 h-8 rounded-lg" />
        </div>
        <Skeleton className="w-full h-20 rounded-xl" />
        <Skeleton className="w-full h-20 rounded-xl" />
      </div>
    </div>
  );
}
