import { notFound } from "next/navigation";
import { EntryCard } from "@/components/entry-card";
import { SetupNotice } from "@/components/setup-notice";
import { getEntriesForProject, getProjectBySlug } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { weekLabel } from "@/lib/week";

export const dynamic = "force-dynamic";

export default async function ProjectPage({
  params,
}: PageProps<"/projects/[slug]">) {
  if (!isSupabaseConfigured) return <SetupNotice />;

  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const entries = await getEntriesForProject(project.id);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          {project.name}
        </h1>
        {project.description && (
          <p className="text-sm opacity-70">{project.description}</p>
        )}
        {project.repo_url && (
          <a
            href={project.repo_url}
            className="font-mono text-xs underline opacity-70"
            target="_blank"
            rel="noreferrer"
          >
            {project.repo_url}
          </a>
        )}
      </header>

      {entries.length === 0 ? (
        <p className="text-sm opacity-70">No published entries yet.</p>
      ) : (
        <div className="space-y-6">
          {entries.map((entry) => (
            <div key={entry.id} className="space-y-2">
              <p className="font-mono text-xs uppercase tracking-wide opacity-60">
                {weekLabel(entry.week_start)}
              </p>
              <EntryCard entry={entry} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
