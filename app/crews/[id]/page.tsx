"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CrewPageRedirect() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    if (params?.id) {
      router.replace(`/crews/${params.id}/posts`);
    }
  }, [params?.id, router]);

  return null;
}
