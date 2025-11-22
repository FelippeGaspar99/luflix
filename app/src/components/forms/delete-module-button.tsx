'use client';

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteModuleAction } from "@/app/(private)/admin/actions";
import { Button } from "@/components/ui/button";

interface Props {
  moduleId: string;
}

export function DeleteModuleButton({ moduleId }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="danger"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await deleteModuleAction(moduleId);
          router.push("/admin");
        })
      }
    >
      Excluir módulo
    </Button>
  );
}
