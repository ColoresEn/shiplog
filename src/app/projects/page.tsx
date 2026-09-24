import Link from "next/link";
import { SetupNotice } from "@/components/setup-notice";
import { getProjects } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  if (!isSupabaseConfigured) return <SetupNotice />;

  const projects = await getProjects();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
      {projects.length === 0 ? (
        <p className="text-sm opacity-70">No projects yet.</p>
      ) : (
        <ul className="space-y-3">
          {projects.map((project) => (
            <li
              key={project.id}
              className="rounded-lg border border-black/10 p-4 dark:border-white/15"
            >
              <Link
                href={`/projects/${project.slug}`}
                className="font-medium hover:underline"
              >
                {project.name}
              </Link>
              {project.description && (
                <p className="mt-1 text-sm opacity-70">{project.description}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
