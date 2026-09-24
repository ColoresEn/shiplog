export type Project = {
  id: string;
  owner_id: string;
  slug: string;
  name: string;
  description: string | null;
  repo_url: string | null;
  created_at: string;
};

export type Entry = {
  id: string;
  owner_id: string;
  project_id: string | null;
  week_start: string;
  title: string;
  body: string;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type EntryWithProject = Entry & {
  project: Pick<Project, "id" | "name" | "slug"> | null;
};
