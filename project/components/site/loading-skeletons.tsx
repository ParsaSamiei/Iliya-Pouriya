import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function LoadingShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div aria-busy="true" aria-live="polite" className={cn("min-h-[50dvh]", className)}>
      <span className="sr-only">Loading</span>
      {children}
    </div>
  );
}

export function PageHeaderSkeleton({
  narrow,
  withSubtitle = true,
}: {
  narrow?: boolean;
  withSubtitle?: boolean;
}) {
  return (
    <div>
      <Skeleton className={cn("h-9 w-48 sm:h-10", narrow ? "w-40" : "sm:w-56")} />
      {withSubtitle && <Skeleton className="mt-3 h-4 w-72 max-w-full" />}
    </div>
  );
}

export function ProjectCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("surface-card overflow-hidden", className)}>
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-1.5 pt-1">
          <Skeleton className="h-5 w-14" />
          <Skeleton className="h-5 w-16" />
        </div>
      </div>
    </div>
  );
}

export function TeamCardSkeleton() {
  return (
    <div className="surface-card flex flex-col p-6">
      <div className="flex items-start gap-4">
        <Skeleton className="size-16 shrink-0 rounded-sm" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
      <Skeleton className="mt-4 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-5/6" />
      <Skeleton className="mt-5 h-4 w-24" />
    </div>
  );
}

export function BlogCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("border-b border-border py-5 sm:border sm:border-border sm:bg-surface sm:p-5", className)}>
      <Skeleton className="h-3 w-28" />
      <Skeleton className="mt-3 h-5 w-4/5" />
      <Skeleton className="mt-3 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-2/3" />
      <Skeleton className="mt-4 h-4 w-20" />
    </div>
  );
}

export function BlogListItemSkeleton() {
  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-6">
      <Skeleton className="h-3 w-32" />
      <Skeleton className="mt-3 h-6 w-3/4" />
      <Skeleton className="mt-3 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-5/6" />
    </div>
  );
}

export function ArticleBodySkeleton({ lines = 8 }: { lines?: number }) {
  return (
    <div className="mt-8 space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-4", i % 4 === 3 ? "w-2/3" : i % 5 === 0 ? "w-11/12" : "w-full")}
        />
      ))}
    </div>
  );
}

export function ProjectsPageSkeleton() {
  return (
    <LoadingShell>
      <div className="mx-auto max-w-6xl px-4 py-16">
        <PageHeaderSkeleton />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
          <ProjectCardSkeleton className="hidden lg:block" />
          <ProjectCardSkeleton className="hidden sm:block lg:hidden" />
        </div>
      </div>
    </LoadingShell>
  );
}

export function ProjectDetailSkeleton() {
  return (
    <LoadingShell>
      <article className="mx-auto max-w-3xl px-4 py-16">
        <Skeleton className="mb-8 aspect-video w-full rounded-[var(--radius-lg)]" />
        <Skeleton className="h-10 w-4/5 max-w-xl" />
        <div className="mt-4 flex flex-wrap gap-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="mt-8 space-y-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-80 w-full rounded-[var(--radius-lg)] sm:h-96" />
        </div>
        <ArticleBodySkeleton />
      </article>
    </LoadingShell>
  );
}

export function BlogPageSkeleton() {
  return (
    <LoadingShell>
      <div className="mx-auto max-w-3xl px-4 py-16">
        <PageHeaderSkeleton narrow />
        <div className="mt-10 space-y-4">
          <BlogListItemSkeleton />
          <BlogListItemSkeleton />
          <BlogListItemSkeleton />
        </div>
      </div>
    </LoadingShell>
  );
}

export function BlogPostSkeleton() {
  return (
    <LoadingShell>
      <article className="mx-auto max-w-3xl px-4 py-16">
        <Skeleton className="mb-8 aspect-video w-full rounded-[var(--radius-lg)]" />
        <Skeleton className="h-3 w-48" />
        <Skeleton className="mt-3 h-10 w-4/5 max-w-xl" />
        <ArticleBodySkeleton lines={10} />
      </article>
    </LoadingShell>
  );
}

export function AboutPageSkeleton() {
  return (
    <LoadingShell>
      <div className="mx-auto max-w-3xl px-4 py-16">
        <PageHeaderSkeleton withSubtitle={false} />
        <div className="mt-6 space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 rounded-[var(--radius-lg)] border border-border bg-surface p-4">
              <Skeleton className="size-10 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </LoadingShell>
  );
}

export function ContactPageSkeleton() {
  return (
    <LoadingShell>
      <div className="mx-auto max-w-xl px-4 py-16">
        <PageHeaderSkeleton narrow />
        <div className="mt-10 space-y-5">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-36 w-full" />
          </div>
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
    </LoadingShell>
  );
}

export function TeamMemberSkeleton() {
  return (
    <LoadingShell>
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <Skeleton className="size-24 shrink-0 rounded-full" />
          <div className="flex w-full flex-col items-center gap-3 sm:items-start">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-4 w-36" />
            <div className="flex gap-2">
              <Skeleton className="size-9" />
              <Skeleton className="size-9" />
              <Skeleton className="size-9" />
            </div>
          </div>
        </div>
        <div className="mt-8 space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <Skeleton className="mt-6 h-9 w-32" />
        <div className="mt-12 space-y-4">
          <Skeleton className="h-6 w-36" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border-l border-border pl-6">
              <Skeleton className="h-4 w-56" />
              <Skeleton className="mt-2 h-3 w-28" />
              <Skeleton className="mt-2 h-4 w-full max-w-md" />
            </div>
          ))}
        </div>
        <div className="mt-12 space-y-4">
          <Skeleton className="h-6 w-24" />
          <div className="flex flex-wrap gap-1.5">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-16" />
            ))}
          </div>
        </div>
      </div>
    </LoadingShell>
  );
}

export function AdminPageSkeleton() {
  return (
    <LoadingShell className="min-h-[40dvh]">
      <div className="space-y-8">
        <Skeleton className="h-8 w-40" />
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-[var(--radius-lg)] border border-border bg-surface p-5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-4 h-9 w-16" />
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <Skeleton className="h-5 w-36" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </LoadingShell>
  );
}

export function StlViewerSkeleton({ className }: { className?: string }) {
  return (
    <Skeleton
      className={cn("h-80 w-full rounded-[var(--radius-lg)] sm:h-96", className)}
      aria-label="Loading 3D model"
    />
  );
}
