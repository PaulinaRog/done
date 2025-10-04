import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import EmptyState from "./components/EmptyState";
import ProjectCard from "./components/ProjectCard";
import SprintHeader from "./components/SprintHeader";
import SprintSearch from "./components/SprintSearch";
import { redirect } from "next/navigation";
import { getMyRole, getCardsForSprint, getCurrentSprint, getNextSprint, getPrevSprint, getSprintById, getUser } from "./data/api";
import type { SprintSearchParams } from "./utils/Interface";
import SuspenseWrapper from "./components/SuspenseWrapper";

export default async function Page({ searchParams }: { searchParams: Promise<SprintSearchParams> }) {
  const supabase = createServerComponentClient({ cookies });

  const user = await getUser(supabase);
  if (!user) {
    redirect("/konto/logowanie");
  }

  const sp = await searchParams;
  const role = await getMyRole(supabase);
  const canManage = role && (role === 3 || role === 2);

  const nowIso = new Date().toISOString();
  const current = await getCurrentSprint(supabase, nowIso);

  let sprint: Awaited<ReturnType<typeof getCurrentSprint>> = null;
  if (sp?.sprintId) {
    const parsed = Number(sp.sprintId);
    sprint = Number.isFinite(parsed) ? await getSprintById(supabase, parsed) : null;
  }

  if (!sprint) sprint = current;

  if (!sprint) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <Header />
        <EmptyState title="Brak aktualnego sprintu" subtitle='".' {...(canManage ? { ctaHref: "/projekty", ctaLabel: "Dodaj projekt" } : {})} />
      </main>
    );
  }

  const q = (sp.q ?? "").trim();
  const releaseOnly = sp.only === "1";
  const isCurrent = !!(current && sprint && current.id === sprint.id);

  const [prevS, nextS, cards] = await Promise.all([
    getPrevSprint(supabase, sprint),
    getNextSprint(supabase, sprint),
    getCardsForSprint(supabase, sprint.id, { q, releaseOnly }),
  ]);

  return (
    <main className="mx-auto max-w-6xl md:p-6 p-2">
      <Header />
      <div className="mt-2 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <SprintHeader start={sprint.start} end={sprint.end} prevId={prevS?.id} nextId={nextS?.id} q={q} only={releaseOnly} isCurrent={isCurrent} />
        <SuspenseWrapper>
          <SprintSearch initialQuery={q} initialOnly={releaseOnly} />
        </SuspenseWrapper>
      </div>
      <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 mb-10 lg:mb-3">
        {cards.length === 0 ? (
          <div className="col-span-full">
            <EmptyState title="Brak projektów dla wybranego filtra" subtitle='Zmień kryteria wyszukiwania lub dodaj projekt".' {...(canManage ? { ctaHref: "/projekty", ctaLabel: "Dodaj projekt" } : {})} />
          </div>
        ) : (cards.map(({ project, link }) => (
          <ProjectCard key={`${sprint.id}-${project.id}`} project={project} sprintId={sprint.id}
            link={link} sprintStart={sprint.start} sprintEnd={sprint.end}
          />
        ))
        )}
      </section>
    </main>
  );
}

function Header() {
  return (
    <header className="flex items-center gap-2">
      <span className="text-lg font-semibold tracking-tight">Done Deliveries</span>
      <span className="text-gray-400">/</span>
      <span className="text-gray-500">Sprint Panel</span>
    </header>
  );
}
