import ProjectsManagement from "@/app/components/ProjectsManagement";
import SuspenseWrapper from "@/app/components/SuspenseWrapper";

export default function Page() {
    return (
        <main className="mx-auto max-w-6xl p-2 md:p-6">
            <SuspenseWrapper>
                <ProjectsManagement />
            </SuspenseWrapper>
        </main>
    );
}
