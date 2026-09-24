import Link from "next/link";
import type { Entry, Project } from "@/lib/types";
import { weekStart } from "@/lib/week";

type Props = {
  action: (formData: FormData) => Promise<void>;
  projects: Project[];
  entry?: Entry;
  submitLabel: string;
};

const inputClass =
  "w-full rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/20";

export function EntryForm({ action, projects, entry, submitLabel }: Props) {
  return (
    <form action={action} className="space-y-4">
      {entry && <input type="hidden" name="id" value={entry.id} />}

      <label className="block space-y-1">
        <span className="text-sm font-medium">Title</span>
        <input
          name="title"
          required
          defaultValue={entry?.title}
          className={inputClass}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1">
          <span className="text-sm font-medium">Week (Monday)</span>
          <input
            type="date"
            name="week_start"
            defaultValue={entry?.week_start ?? weekStart()}
            className={inputClass}
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium">Project</span>
          <select
            name="project_id"
            defaultValue={entry?.project_id ?? ""}
            className={inputClass}
          >
            <option value="">No project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block space-y-1">
        <span className="text-sm font-medium">Body (Markdown)</span>
        <textarea
          name="body"
          rows={12}
          defaultValue={entry?.body}
          className={`${inputClass} font-mono`}
        />
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="published"
          defaultChecked={entry?.published ?? false}
        />
        Published
      </label>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
        >
          {submitLabel}
        </button>
        <Link href="/dashboard" className="text-sm underline opacity-70">
          Cancel
        </Link>
      </div>
    </form>
  );
}
