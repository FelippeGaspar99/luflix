'use client';

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/layout/logo";

const loginSchema = z.object({
  username: z.string().min(1, "Informe seu usuário"),
  password: z.string().min(6, "Senha mínima de 6 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    setError(null);
    const response = await signIn("credentials", {
      redirect: false,
      username: data.username,
      password: data.password,
    });

    if (response?.error) {
      setError("Credenciais inválidas");
      return;
    }

    router.replace("/");
  };

  return (
    <div className="grid w-full gap-10 rounded-3xl bg-slate-950/70 p-10 shadow-2xl shadow-black/60 sm:grid-cols-2">
      <div className="space-y-6">
        <Logo />
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
          Plataforma segura de treinamentos corporativos
        </p>
        <h1 className="text-4xl font-bold text-white">Bem-vindo ao LUFLIX</h1>
        <p className="text-slate-400">
          Acesse seus treinamentos, acompanhe módulos liberados e gere certificados com um visual inspirado nas melhores
          plataformas de streaming.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Usuário</label>
          <Input type="text" placeholder="seu.usuario" {...register("username")} />
          {errors.username && <p className="text-xs text-red-400">{errors.username.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Senha</label>
          <Input type="password" placeholder="••••••" {...register("password")} />
          {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button type="submit" disabled={isSubmitting} className="w-full py-3 text-base">
          {isSubmitting ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </div>
  );
}
