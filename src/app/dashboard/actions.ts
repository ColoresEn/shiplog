"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { weekStart } from "@/lib/week";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function createProject(formData: FormData) {
  const { supabase, user } = await requireUser();

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const { error } = await supabase.from("projects").insert({
    owner_id: user.id,
    name,
    slug: slugify(name),
    description: String(formData.get("description") ?? "").trim() || null,
    repo_url: String(formData.get("repo_url") ?? "").trim() || null,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath("/projects");
}

export async function createEntry(formData: FormData) {
  const { supabase, user } = await requireUser();

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  const projectId = String(formData.get("project_id") ?? "");

  const { error } = await supabase.from("entries").insert({
    owner_id: user.id,
    project_id: projectId || null,
    week_start: String(formData.get("week_start") ?? "") || weekStart(),
    title,
    body: String(formData.get("body") ?? ""),
    published: formData.get("published") === "on",
  });
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath("/");
  redirect("/dashboard");
}

export async function updateEntry(formData: FormData) {
  const { supabase } = await requireUser();

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const projectId = String(formData.get("project_id") ?? "");

  const { error } = await supabase
    .from("entries")
    .update({
      project_id: projectId || null,
      week_start: String(formData.get("week_start") ?? "") || weekStart(),
      title: String(formData.get("title") ?? "").trim(),
      body: String(formData.get("body") ?? ""),
      published: formData.get("published") === "on",
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath("/");
  redirect("/dashboard");
}

export async function deleteEntry(formData: FormData) {
  const { supabase } = await requireUser();

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const { error } = await supabase.from("entries").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath("/");
}
