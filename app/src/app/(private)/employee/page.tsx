import { requireEmployee } from "@/auth/guards";
import { getModulesForEmployee } from "@/controllers/moduleController";
import { getModuleProgress, getRecentVideos } from "@/controllers/progressController";
import { getCertificatesForUser } from "@/controllers/certificateController";
import { EmployeeDashboardView } from "@/views/employee/dashboard-view";

interface PageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function EmployeePage({ searchParams }: PageProps) {
  const session = await requireEmployee();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const search = typeof resolvedSearchParams?.search === "string" ? resolvedSearchParams.search : undefined;
  const modules = await getModulesForEmployee(session.user.id, search);

  const modulesWithProgress = await Promise.all(
    modules.map(async (module: any) => {
      const progress = await getModuleProgress(session.user.id, module.id);
      return {
        id: module.id,
        title: module.title,
        description: module.description,
        coverUrl: module.coverUrl,
        videosCount: module.videos?.length ?? 0,
        progress: progress.percentage,
      };
    }),
  );

  const recentVideos = await getRecentVideos(session.user.id);

  const certificatesFromDb = await getCertificatesForUser(session.user.id);
  const certificates = certificatesFromDb.map((certificate) => ({
    id: certificate.id,
    moduleTitle: certificate.module.title,
    issuedAt: certificate.issuedAt.toLocaleDateString("pt-BR"),
  }));

  return <EmployeeDashboardView modules={modulesWithProgress} certificates={certificates} recentVideos={recentVideos} />;
}
