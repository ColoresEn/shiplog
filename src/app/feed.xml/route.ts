import { NextResponse, type NextRequest } from "next/server";
import { getPublishedEntries } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { weekId } from "@/lib/week";

export const dynamic = "force-dynamic";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured) {
    return new NextResponse("Supabase is not configured", { status: 503 });
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin;
  const entries = await getPublishedEntries(50);

  const items = entries
    .map(
      (entry) => `    <item>
      <title>${escapeXml(entry.title)}</title>
      <link>${origin}/week/${weekId(entry.week_start)}</link>
      <guid isPermaLink="false">${entry.id}</guid>
      <pubDate>${new Date(entry.created_at).toUTCString()}</pubDate>
      <description>${escapeXml(entry.body)}</description>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>shiplog</title>
    <link>${origin}</link>
    <description>Weekly progress log across all my projects.</description>
${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
