import type { SupabaseClient } from "@supabase/supabase-js";
import { ProjectRow, SprintRow, LinkRow, Card, IsoDateTime, ID, ChangelogRow, Uuid, UserRoleRow, Role, UserRoleProps } from "../utils/Interface";

// USER

export async function getMyRole(supabase: SupabaseClient): Promise<Role | null> {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return null;
    const { data: row } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id).maybeSingle<{ role: Role }>();
    return row?.role ?? null;
}

export async function getAllUserRoles(supabase: SupabaseClient): Promise<UserRoleProps[]> {
    const { data } = await supabase.from("user_roles").select("user_id, role, email").returns<UserRoleProps[]>();
    return data ?? [];
}

export async function updateUserRole(supabase: SupabaseClient, userId: string, role: Role): Promise<void> {
    const { error } = await supabase.from("user_roles").update({ role }).eq("user_id", userId);
    if (error) throw error;
}

export async function getUser(supabase: SupabaseClient) {
    const { data } = await supabase.auth.getUser();
    return data.user ?? null;
}

export async function createUserRole(supabase: SupabaseClient, userId: Uuid, role: Role = 1, email: string): Promise<UserRoleRow> {
    const { data: existing, error: selErr } = await supabase
        .from("user_roles")
        .select("user_id,role,created_at,email")
        .eq("user_id", userId)
        .maybeSingle<UserRoleRow>();

    if (selErr) throw selErr;
    if (existing) return existing;

    const { data, error } = await supabase
        .from("user_roles")
        .insert([{ user_id: userId, role, email }])
        .select("user_id,role,created_at,email")
        .single<UserRoleRow>();

    if (error) throw error;
    return data;
}

// SPRINTY

export async function getCurrentSprint(supabase: SupabaseClient, nowIso: IsoDateTime): Promise<SprintRow | null> {
    const { data, error } = await supabase
        .from("sprints")
        .select("id, start, end")
        .lte("start", nowIso)
        .gt("end", nowIso)
        .order("start", { ascending: false })
        .limit(1)
        .maybeSingle<SprintRow>();
    if (error) return null;
    return data ?? null;
}

export async function getSprintById(supabase: SupabaseClient, id: ID): Promise<SprintRow | null> {
    const { data } = await supabase.from("sprints").select("id,start,end").eq("id", id).maybeSingle<SprintRow>();
    return data ?? null;
}

export async function getPrevSprint(supabase: SupabaseClient, current: SprintRow): Promise<SprintRow | null> {
    const { data } = await supabase
        .from("sprints")
        .select("id,start,end")
        .lte("end", current.start)
        .order("end", { ascending: false })
        .limit(1)
        .maybeSingle<SprintRow>();
    return data ?? null;
}

export async function getNextSprint(supabase: SupabaseClient, current: SprintRow): Promise<SprintRow | null> {
    const { data } = await supabase
        .from("sprints")
        .select("id,start,end")
        .gte("start", current.end)
        .order("start", { ascending: true })
        .limit(1)
        .maybeSingle<SprintRow>();
    return data ?? null;
}

export async function getCardsForSprint(supabase: SupabaseClient, sprintId: ID, opts?: { q?: string; releaseOnly?: boolean }): Promise<Card[]> {
    const q = (opts?.q ?? "").trim();
    const releaseOnly = !!opts?.releaseOnly;

    let linkBuilder = supabase.from("sprint_projects").select("project_id, release, release_date, changelog_id").eq("sprint_id", sprintId);
    if (releaseOnly) linkBuilder = linkBuilder.eq("release", true);

    const { data: links, error: linkErr } = await linkBuilder.returns<Omit<LinkRow, "sprint_id">[]>();
    if (linkErr || !links || links.length === 0) return [];

    const ids = [...new Set(links.map((l) => l.project_id))];

    let projBuilder = supabase.from("projects").select("id, name, client").in("id", ids);
    if (q) {
        const safe = q.replace(/[%]/g, "").replace(/,/g, " ");
        projBuilder = projBuilder.or(`name.ilike.%${safe}%,client.ilike.%${safe}%`);
    }

    const { data: prows, error: projErr } = await projBuilder.returns<ProjectRow[]>();
    if (projErr || !prows) return [];

    const byId = new Map(prows.map((p) => [p.id, p]));

    return links
        .map<Card | null>((l) => {
            const p = byId.get(l.project_id);
            if (!p) return null;
            return {
                project: {
                    id: p.id,
                    name: p.name,
                    client: p.client,
                    release: l.release ? { version: l.changelog_id ? `#${l.changelog_id}` : "v?", date: l.release_date ?? "", changelog: [] } : null,
                },
                link: { release: l.release, release_date: l.release_date, changelog_id: l.changelog_id },
            };
        })
        .filter((x): x is Card => !!x);
}

// CHANGELOG I RELEASE

export async function fetchChangelogById(supabase: SupabaseClient, id: ID): Promise<ChangelogRow | null> {
    const { data } = await supabase.from("changelogs").select("id,version,date,changelog").eq("id", id).maybeSingle<ChangelogRow>();
    return data ?? null;
}

export async function updateChangelog(supabase: SupabaseClient, id: ID, version: string, lines: string[]): Promise<ChangelogRow> {
    const { data, error } = await supabase
        .from("changelogs")
        .update({ version: version || "v?", changelog: lines })
        .eq("id", id)
        .select("id,version,date,changelog")
        .single<ChangelogRow>();
    if (error) throw error;
    return data;
}

export async function toggleRelease(supabase: SupabaseClient, params: { sprintId: ID; projectId: ID; on: boolean; changelogId?: ID | null }) {
    const { sprintId, projectId, on, changelogId } = params;
    const { error } = await supabase
        .from("sprint_projects")
        .update({ release: on, release_date: on ? new Date().toISOString() : null, changelog_id: on ? (changelogId ?? null) : null })
        .match({ sprint_id: sprintId, project_id: projectId });
    return error ?? null;
}

export async function updateReleaseDate(supabase: SupabaseClient,params: { sprintId: ID; projectId: ID; releaseDate: IsoDateTime }): Promise<void> {
    const { sprintId, projectId, releaseDate } = params;
    const { error } = await supabase
        .from("sprint_projects")
        .update({ release_date: releaseDate })
        .match({ sprint_id: sprintId, project_id: projectId });
    if (error) throw error;
}

export async function addChangelogAndAttach(supabase: SupabaseClient, params: { sprintId: ID; projectId: ID; version: string; lines: string[] }): Promise<ChangelogRow> {
    const { sprintId, projectId, version, lines } = params;

    await supabase.from("sprint_projects").update({ release: true, release_date: new Date().toISOString() }).match({ sprint_id: sprintId, project_id: projectId });

    const { data: chg, error: insErr } = await supabase
        .from("changelogs")
        .insert([{ version: version || "v?", date: new Date().toISOString(), changelog: lines }])
        .select("id,version,date,changelog")
        .single<ChangelogRow>();
    if (insErr) throw insErr;

    const { error: upErr } = await supabase.from("sprint_projects").update({ changelog_id: chg.id }).match({ sprint_id: sprintId, project_id: projectId });
    if (upErr) throw upErr;

    return chg;
}

// PROJEKTY

export async function addProject(supabase: SupabaseClient, p: { name: string; client?: string | null; project_start: string; project_end: string }): Promise<ID> {
    const { data, error } = await supabase
        .from("projects")
        .insert([{ name: p.name, client: p.client ?? null, project_start: p.project_start, project_end: p.project_end }])
        .select("id")
        .single<{ id: ID }>();
    if (error) throw error;
    return data.id;
}

export async function updateProjectDates(supabase: SupabaseClient, p: { projectId: ID; name?: string; client?: string | null; startDate: string; endDate: string }): Promise<void> {
    const { error } = await supabase.from("projects").update({ name: p.name, client: p.client ?? null, project_start: p.startDate, project_end: p.endDate }).eq("id", p.projectId);
    if (error) throw error;
}

export async function getSprintAttachmentCount(supabase: SupabaseClient, projectId: ID): Promise<number> {
    const { count } = await supabase.from("sprint_projects").select("*", { count: "exact", head: true }).eq("project_id", projectId);
    return count ?? 0;
}

export async function getProjectById(supabase: SupabaseClient, id: ID) {
    const { data, error } = await supabase.from("projects").select("id, name, client, project_start, project_end").eq("id", id).maybeSingle();
    if (error) throw error;
    return data as { id: ID; name: string; client: string | null; project_start: string | null; project_end: string | null } | null;
}

export async function deleteProjectCompletely(supabase: SupabaseClient, projectId: ID): Promise<{ removedLinks: number; removedChangelogs: number }> {
    const { data: deletedLinks, error: delLinksErr } = await supabase.from("sprint_projects").delete().eq("project_id", projectId).select("changelog_id");
    if (delLinksErr) throw delLinksErr;
    const chgIds = Array.from(new Set((deletedLinks ?? []).map((r) => r.changelog_id).filter((x): x is ID => x !== null)));
    let removedChangelogs = 0;
    if (chgIds.length > 0) {
        const { data: delChg, error: delChgErr } = await supabase.from("changelogs").delete().in("id", chgIds).select("id");
        if (delChgErr) throw delChgErr;
        removedChangelogs = delChg?.length ?? chgIds.length;
    }
    const { error: delProjErr } = await supabase.from("projects").delete().eq("id", projectId);
    if (delProjErr) throw delProjErr;
    return { removedLinks: deletedLinks?.length ?? 0, removedChangelogs };
}
