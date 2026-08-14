"use client";

import { PostItem, usePosts } from "@/entities/post";
import { DeletePostModal } from "@/features/delete-post";
import { EditPostModal } from "@/features/edit-post";
import { ArrowRotateRight, Comment, TriangleExclamationFill } from "@gravity-ui/icons";
import { Button, Card, CardContent, Spinner } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CrewPostCard } from "./CrewPostCard";

interface CrewPostsListProps {
  crewId: number;
  isOwner: boolean;
}

export function CrewPostsList({ crewId, isOwner }: CrewPostsListProps) {
  const { t } = useTranslation();

  const [editingPost, setEditingPost] = useState<PostItem | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<number | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
    refetch,
  } = usePosts(crewId);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 },
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <Spinner size="lg" color="accent" />
        <p className="text-sm text-foreground/60">{t("posts.loading")}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="border border-border/60 bg-surface/30 backdrop-blur-md rounded-3xl p-8 text-center">
        <CardContent className="flex flex-col items-center gap-4 p-0">
          <div className="w-12 h-12 rounded-2xl bg-danger/10 text-danger flex items-center justify-center border border-danger/20">
            <TriangleExclamationFill className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-bold text-foreground">
              {t("posts.error_title")}
            </h3>
            <p className="text-xs text-foreground/60">{t("posts.error_desc")}</p>
          </div>
          <Button
            variant="outline"
            onPress={() => refetch()}
            className="flex items-center gap-2 mt-2"
          >
            <ArrowRotateRight className="w-4 h-4" />
            <span>{t("posts.retry_btn")}</span>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const allPosts = data?.pages.flatMap((page) => page.items) ?? [];

  if (allPosts.length === 0) {
    return (
      <Card className="border border-border/60 bg-surface/30 backdrop-blur-md rounded-3xl p-10 sm:p-14 text-center animate-in fade-in-0 duration-300">
        <CardContent className="flex flex-col items-center gap-4 max-w-md mx-auto p-0">
          <div className="w-14 h-14 rounded-2xl bg-surface-secondary text-foreground/60 flex items-center justify-center border border-border/50">
            <Comment className="w-7 h-7" />
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 className="text-lg font-bold text-foreground">
              {t("posts.empty.title")}
            </h3>
            <p className="text-sm text-foreground/60 leading-relaxed">
              {t("posts.empty.desc")}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {allPosts.map((post) => (
          <CrewPostCard
            key={post.id}
            post={post}
            isOwner={isOwner}
            onEdit={(p) => setEditingPost(p)}
            onDelete={(id) => setDeletingPostId(id)}
          />
        ))}

        {hasNextPage && (
          <div ref={loadMoreRef} className="flex justify-center py-4">
            {isFetchingNextPage ? (
              <Spinner size="md" color="accent" />
            ) : (
              <Button
                variant="outline"
                size="sm"
                onPress={() => fetchNextPage()}
                className="text-xs"
              >
                Load more
              </Button>
            )}
          </div>
        )}
      </div>

      <EditPostModal
        post={editingPost}
        crewId={crewId}
        isOpen={Boolean(editingPost)}
        onClose={() => setEditingPost(null)}
      />

      <DeletePostModal
        postId={deletingPostId}
        crewId={crewId}
        isOpen={Boolean(deletingPostId)}
        onClose={() => setDeletingPostId(null)}
      />
    </>
  );
}
