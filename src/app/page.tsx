import Link from "next/link";
import { EntryCard } from "@/components/entry-card";
import { SetupNotice } from "@/components/setup-notice";
import { getPublishedEntries } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { groupByWeek, weekId, weekLabel } from "@/lib/week";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  if (!isSupabaseConfigured) return <SetupNotice />;

  const entries = await getPublishedEntries();
  const weeks = groupByWeek(entries);

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">
          Weekly shipping log
        </h1>
        <p className="mt-1 text-sm opacity-70">
          What moved forward across all my projects, week by week.
        </p>
      </section>

      {weeks.length === 0 && (
        <p className="text-sm opacity-70">
          No published entries yet. Write the first one from the{" "}
          <Link href="/dashboard" className="underline">
            dashboard
          </Link>
          .
        </p>
      )}

      {weeks.map(([week, weekEntries]) => (
        <section key={week} className="space-y-4">
          <h2 className="font-mono text-sm uppercase tracking-wide opacity-60">
            <Link href={`/week/${weekId(week)}`} className="hover:underline">
              {weekLabel(week)}
            </Link>
          </h2>
          <div className="space-y-4">
            {weekEntries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
