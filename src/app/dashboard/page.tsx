import Link from "next/link";
import { redirect } from "next/navigation";
import { SetupNotice } from "@/components/setup-notice";
import { getOwnEntries, getProjects } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { weekLabel } from "@/lib/week";
import { signOut } from "@/app/login/actions";
import { createProject, deleteEntry } from "./actions";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!isSupabaseConfigured) return <SetupNotice />;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [entries, projects] = await Promise.all([
    getOwnEntries(),
    getProjects(),
  ]);

  return (
    <div className="space-y-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm opacity-70">{user.email}</p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/entries/new"
            className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
          >
            New entry
          </Link>
          <form action={signOut}>
            <button type="submit" className="text-sm underline opacity-70">
              Sign out
            </button>
          </form>
        </div>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Entries</h2>
        {entries.length === 0 && (
          <p className="text-sm opacity-70">No entries yet.</p>
        )}
        <ul className="space-y-2">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="flex items-center justify-between gap-4 rounded-md border border-black/10 px-4 py-3 dark:border-white/15"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{entry.title}</p>
                <p className="font-mono text-xs opacity-60">
                  {weekLabel(entry.week_start)}
                  {entry.project ? ` · ${entry.project.name}` : ""}
                  {entry.published ? "" : " · draft"}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3 text-sm">
                <Link
                  href={`/dashboard/entries/${entry.id}`}
                  className="underline"
                >
                  Edit
                </Link>
                <form action={deleteEntry}>
                  <input type="hidden" name="id" value={entry.id} />
                  <button type="submit" className="text-red-600 underline">
                    Delete
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Projects</h2>
        <ul className="space-y-1 text-sm">
          {projects.map((project) => (
            <li key={project.id} className="font-mono opacity-70">
              {project.slug}
            </li>
          ))}
        </ul>
        <form action={createProject} className="grid gap-3 sm:grid-cols-3">
          <input
            name="name"
            required
            placeholder="Project name"
            className="rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/20"
          />
          <input
            name="description"
            placeholder="Short description"
            className="rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/20"
          />
          <input
            name="repo_url"
            placeholder="https://github.com/…"
            className="rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/20"
          />
          <button
            type="submit"
            className="justify-self-start rounded-md border border-black/15 px-4 py-2 text-sm dark:border-white/20"
          >
            Add project
          </button>
        </form>
      </section>
    </div>
  );
}
