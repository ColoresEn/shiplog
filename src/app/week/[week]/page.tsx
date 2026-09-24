import { notFound } from "next/navigation";
import { EntryCard } from "@/components/entry-card";
import { SetupNotice } from "@/components/setup-notice";
import { getEntriesForWeek } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { weekLabel, weekStartFromId } from "@/lib/week";

export const dynamic = "force-dynamic";

export default async function WeekPage({ params }: PageProps<"/week/[week]">) {
  const { week } = await params;
  const start = weekStartFromId(week);
  if (!start) notFound();

  if (!isSupabaseConfigured) return <SetupNotice />;

  const entries = await getEntriesForWeek(start);

  return (
    <div className="space-y-6">
      <h1 className="font-mono text-sm uppercase tracking-wide opacity-60">
        {weekLabel(start)}
      </h1>
      {entries.length === 0 ? (
        <p className="text-sm opacity-70">Nothing published this week.</p>
      ) : (
        entries.map((entry) => <EntryCard key={entry.id} entry={entry} />)
      )}
    </div>
  );
}
