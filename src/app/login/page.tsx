import { SetupNotice } from "@/components/setup-notice";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { sendMagicLink } from "./actions";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: PageProps<"/login">) {
  if (!isSupabaseConfigured) return <SetupNotice />;

  const { sent, error } = await searchParams;

  return (
    <div className="mx-auto max-w-sm space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
      <p className="text-sm opacity-70">
        Magic link sign-in for the log owner.
      </p>

      <form action={sendMagicLink} className="space-y-3">
        <input
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          className="w-full rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/20"
        />
        <button
          type="submit"
          className="w-full rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background"
        >
          Send magic link
        </button>
      </form>

      {sent && (
        <p className="text-sm text-green-700 dark:text-green-400">
          Check your inbox for the sign-in link.
        </p>
      )}
      {error && (
        <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
