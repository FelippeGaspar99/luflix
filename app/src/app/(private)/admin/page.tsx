import { AdminDashboardView } from "@/views/admin/dashboard-view";
import { getModulesForAdmin } from "@/controllers/moduleController";
import { requireAdmin } from "@/auth/guards";

interface PageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminPage({ searchParams }: PageProps) {
  await requireAdmin();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const search = typeof resolvedSearchParams?.search === "string" ? resolvedSearchParams.search : undefined;
  const modulesFromDb = await getModulesForAdmin(search);

  const modules = modulesFromDb.map((module: any) => ({
    id: module.id,
    title: module.title,
    description: module.description,
    coverUrl: module.coverUrl,
    videosCount: module.videos?.length ?? 0,
  }));

  return <AdminDashboardView modules={modules} />;
}
