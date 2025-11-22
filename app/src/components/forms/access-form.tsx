'use client';

import { assignModuleAction, revokeModuleAction } from "@/app/(private)/admin/actions";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { defaultActionState } from "@/types/actions";
import { useActionState, useTransition } from "react";

interface Props {
  moduleId: string;
  employees: { id: string; name: string }[];
  granted: { id: string; name: string; email: string }[];
}

export function AccessForm({ moduleId, employees, granted }: Props) {
  const [state, formAction] = useActionState(assignModuleAction, defaultActionState as any);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="moduleId" value={moduleId} />
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Conceder acesso</label>
          <Select name="userId" defaultValue="" required>
            <option value="" disabled>
              Escolha um funcionário
            </option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </Select>
        </div>
        {(state as any).error && <p className="text-sm text-red-400">{(state as any).error}</p>}
        <Button type="submit" className="w-full">
          Liberar módulo
        </Button>
      </form>

      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Funcionários com acesso</p>
        <ul className="space-y-2 text-sm">
          {granted.length === 0 && <li className="text-slate-500">Nenhum usuário liberado ainda.</li>}
          {granted.map((user) => (
            <li
              key={user.id}
              className="flex items-center justify-between rounded-2xl border border-slate-800 px-4 py-2"
            >
              <div>
                <p className="font-semibold text-white">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    await revokeModuleAction(moduleId, user.id);
                  })
                }
                className="text-sm text-rose-400 hover:text-white"
              >
                Remover
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
