"use client";

import { Card, Skeleton } from "@heroui/react";

export function JoinCrewLoadingState() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-md overflow-hidden border border-border/60 bg-surface/40 backdrop-blur-xl rounded-3xl shadow-xl">
        <Skeleton className="w-full h-36 sm:h-44" />
        <div className="flex flex-col items-center px-6 pb-6 -mt-12 sm:-mt-14 relative z-10 gap-4">
          <Skeleton className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl ring-4 ring-background" />
          <div className="flex flex-col items-center gap-2 w-full">
            <Skeleton className="w-48 h-6 rounded-lg" />
            <Skeleton className="w-28 h-5 rounded-full" />
          </div>
          <div className="w-full flex flex-col gap-3 pt-4 border-t border-border/40">
            <Skeleton className="w-full h-4 rounded-md" />
            <Skeleton className="w-full h-10 rounded-xl" />
            <div className="flex items-center gap-3 pt-2">
              <Skeleton className="w-1/2 h-10 rounded-xl" />
              <Skeleton className="w-1/2 h-10 rounded-xl" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
