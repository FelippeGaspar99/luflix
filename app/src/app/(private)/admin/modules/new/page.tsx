import { requireAdmin } from "@/auth/guards";
import { CreateModuleForm } from "@/components/forms/create-module-form";
import { Card } from "@/components/ui/card";

export default async function NewModulePage() {
  await requireAdmin();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Novo módulo</h1>
        <p className="text-sm text-slate-500 mt-1">Preencha os dados para cadastrar um novo módulo.</p>
      </div>

      <Card>
        <CreateModuleForm />
      </Card>
    </div>
  );
}
