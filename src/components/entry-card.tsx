import Link from "next/link";
import { renderMarkdown } from "@/lib/markdown";
import type { EntryWithProject } from "@/lib/types";

export function EntryCard({ entry }: { entry: EntryWithProject }) {
  return (
    <article className="rounded-lg border border-black/10 p-5 dark:border-white/15">
      <div className="mb-2 flex flex-wrap items-baseline gap-3">
        <h3 className="text-lg font-semibold">{entry.title}</h3>
        {entry.project && (
          <Link
            href={`/projects/${entry.project.slug}`}
            className="rounded-full bg-black/5 px-2.5 py-0.5 font-mono text-xs hover:underline dark:bg-white/10"
          >
            {entry.project.name}
          </Link>
        )}
        {!entry.published && (
          <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 font-mono text-xs text-amber-700 dark:text-amber-300">
            draft
          </span>
        )}
      </div>
      <div
        className="prose-shiplog text-sm leading-relaxed"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(entry.body) }}
      />
    </article>
  );
}
