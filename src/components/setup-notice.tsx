export function SetupNotice() {
  return (
    <div className="mx-auto max-w-2xl rounded-lg border border-amber-400/40 bg-amber-50 p-6 text-sm text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
      <h2 className="mb-2 text-base font-semibold">Supabase not configured</h2>
      <p className="mb-3">
        Copy <code>.env.example</code> to <code>.env.local</code> and set{" "}
        <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
        <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, then run the SQL in{" "}
        <code>supabase/migrations</code>.
      </p>
      <p>See the README for the full setup steps.</p>
    </div>
  );
}
