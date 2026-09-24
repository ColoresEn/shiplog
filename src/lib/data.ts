import { createClient } from "@/lib/supabase/server";
import type { EntryWithProject, Project } from "@/lib/types";

const ENTRY_SELECT =
  "id, owner_id, project_id, week_start, title, body, published, created_at, updated_at, project:projects (id, name, slug)";

export async function getPublishedEntries(limit = 100) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("entries")
    .select(ENTRY_SELECT)
    .eq("published", true)
    .order("week_start", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as EntryWithProject[];
}

export async function getEntriesForWeek(weekStartDate: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("entries")
    .select(ENTRY_SELECT)
    .eq("published", true)
    .eq("week_start", weekStartDate)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as EntryWithProject[];
}

export async function getProjects() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("name");

  if (error) throw new Error(error.message);
  return (data ?? []) as Project[];
}

export async function getProjectBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as Project | null;
}

export async function getEntriesForProject(projectId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("entries")
    .select(ENTRY_SELECT)
    .eq("project_id", projectId)
    .eq("published", true)
    .order("week_start", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as EntryWithProject[];
}

export async function getOwnEntries() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("entries")
    .select(ENTRY_SELECT)
    .order("week_start", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as EntryWithProject[];
}

export async function getEntry(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("entries")
    .select(ENTRY_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as unknown as EntryWithProject) ?? null;
}
