import {
  BlogCardSkeleton,
  ProjectCardSkeleton,
  TeamCardSkeleton,
} from "@/components/site/loading-skeletons";
import { Skeleton } from "@/components/ui/skeleton";

/** Full-page shiny skeleton matching the IPZ landing layout. */
export function HomeLoadingSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite" className="min-h-[70dvh]">
      <span className="sr-only">Loading</span>

      <section className="landing-section landing-section-hero">
        <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-10 sm:py-14">
          <div className="grid w-full items-center gap-12 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-20">
            <Skeleton className="clip-hex size-32 shrink-0 sm:size-40 lg:size-[11rem]" />
            <div className="flex min-w-0 flex-col gap-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <Skeleton className="h-12 w-40 sm:h-14 sm:w-52 lg:h-16 lg:w-60" />
                <Skeleton className="hidden h-12 w-0.5 sm:block" shiny={false} />
                <Skeleton className="h-12 w-44 sm:h-14 sm:w-56 lg:h-16 lg:w-64" />
              </div>
              <Skeleton className="h-7 w-full max-w-xl sm:h-8" />
              <Skeleton className="h-5 w-full max-w-lg" />
              <Skeleton className="h-5 w-3/4 max-w-md" />
              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <Skeleton className="h-10 w-36" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section landing-section-projects">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:py-24">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Skeleton className="h-3 w-14" />
              <Skeleton className="mt-3 h-8 w-56" />
              <Skeleton className="mt-3 h-4 w-64 max-w-full" />
            </div>
            <Skeleton className="h-9 w-36 shrink-0" />
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
            <ProjectCardSkeleton className="hidden lg:block" />
          </div>
          <div className="mt-12 overflow-hidden rounded-md border border-border">
            <div className="border-b border-border px-4 py-3 sm:px-5">
              <Skeleton className="h-2.5 w-24" />
              <Skeleton className="mt-2 h-5 w-48" />
              <Skeleton className="mt-2 h-3 w-72 max-w-full" />
            </div>
            <div className="grid sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 border-b border-border px-4 py-5 last:border-b-0 sm:flex-col sm:items-start sm:gap-3 sm:border-b-0 sm:border-e sm:px-5 sm:py-6 sm:last:border-e-0"
                >
                  <Skeleton className="size-2 shrink-0" shiny={false} />
                  <Skeleton className="h-2.5 w-14" />
                  <Skeleton className="h-9 w-16" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section landing-section-team">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:py-24">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="mt-3 h-8 w-48" />
          <Skeleton className="mt-3 h-4 w-72 max-w-full" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <TeamCardSkeleton />
            <TeamCardSkeleton />
          </div>
        </div>
      </section>

      <section className="landing-section landing-section-capabilities">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:py-24">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-3 h-8 w-52" />
          <Skeleton className="mt-3 h-4 w-80 max-w-full" />
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="border-s-2 border-border ps-5">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="mt-3 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-5/6" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section landing-section-clients">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:py-24">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="mt-3 h-8 w-56" />
          <Skeleton className="mt-3 h-4 w-80 max-w-full" />
          <div className="mt-10 flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex min-w-[42%] flex-col items-center gap-3 sm:min-w-[22%]">
                <Skeleton className="h-12 w-28" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section landing-section-recommendations">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:py-24">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="mt-3 h-8 w-48" />
          <Skeleton className="mt-3 h-4 w-72 max-w-full" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="surface-card flex flex-col p-6">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="mt-2 h-5 w-5/6" />
                <Skeleton className="mt-2 h-5 w-4/6" />
                <div className="mt-6 flex items-center gap-3">
                  <Skeleton className="size-11 shrink-0 rounded-sm" />
                  <div className="min-w-0 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="mt-2 h-3 w-40" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section landing-section-blog">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:py-24">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Skeleton className="h-3 w-12" />
              <Skeleton className="mt-3 h-8 w-44" />
              <Skeleton className="mt-3 h-4 w-60 max-w-full" />
            </div>
            <Skeleton className="h-9 w-32 shrink-0" />
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <BlogCardSkeleton />
            <BlogCardSkeleton className="hidden sm:block" />
            <BlogCardSkeleton className="hidden lg:block" />
          </div>
        </div>
      </section>

      <section className="landing-section landing-section-contact">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-20">
          <Skeleton className="h-8 w-64 max-w-full" />
          <Skeleton className="mt-4 h-4 w-80 max-w-full" />
          <Skeleton className="mt-8 h-11 w-40" />
        </div>
      </section>
    </div>
  );
}
