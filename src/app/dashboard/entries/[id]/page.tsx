import { notFound } from "next/navigation";
import { EntryForm } from "@/components/entry-form";
import { SetupNotice } from "@/components/setup-notice";
import { getEntry, getProjects } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { updateEntry } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditEntryPage({
  params,
}: PageProps<"/dashboard/entries/[id]">) {
  if (!isSupabaseConfigured) return <SetupNotice />;

  const { id } = await params;
  const [entry, projects] = await Promise.all([getEntry(id), getProjects()]);
  if (!entry) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Edit entry</h1>
      <EntryForm
        action={updateEntry}
        projects={projects}
        entry={entry}
        submitLabel="Update"
      />
    </div>
  );
}
