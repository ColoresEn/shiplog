import { EntryForm } from "@/components/entry-form";
import { SetupNotice } from "@/components/setup-notice";
import { getProjects } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createEntry } from "../../actions";

export const dynamic = "force-dynamic";

export default async function NewEntryPage() {
  if (!isSupabaseConfigured) return <SetupNotice />;

  const projects = await getProjects();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">New entry</h1>
      <EntryForm action={createEntry} projects={projects} submitLabel="Save" />
    </div>
  );
}
