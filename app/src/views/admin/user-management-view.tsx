"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { registerUserAction, toggleModuleAccessAction, deleteUserAction } from "@/actions/user-actions";

interface Module {
    id: string;
    title: string;
}

interface User {
    id: string;
    name: string;
    username: string;
    email: string | null;
    accesses: { moduleId: string }[];
}

interface Props {
    users: User[];
    modules: Module[];
}

export function UserManagementView({ users, modules }: Props) {
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    async function handleRegister(formData: FormData) {
        setIsLoading(true);
        const res = await registerUserAction(formData);
        setIsLoading(false);
        if (res?.error) {
            alert(res.error);
        } else {
            setIsRegisterOpen(false);
        }
    }

    async function handleDelete(userId: string) {
        if (!confirm("Tem certeza que deseja excluir este usuário?")) return;
        const res = await deleteUserAction(userId);
        if (res?.error) {
            alert(res.error);
        }
    }

    async function handleToggleAccess(moduleId: string, hasAccess: boolean) {
        if (!selectedUser) return;

        await toggleModuleAccessAction(selectedUser.id, moduleId, hasAccess);

        setSelectedUser((prev) => {
            if (!prev) return null;
            const newAccesses = hasAccess
                ? [...prev.accesses, { moduleId }]
                : prev.accesses.filter((a) => a.moduleId !== moduleId);
            return { ...prev, accesses: newAccesses };
        });
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Gerenciar Usuários</h1>
                    <p className="text-slate-400">Cadastre funcionários e controle o acesso aos módulos.</p>
                </div>
                <Button onClick={() => setIsRegisterOpen(true)} className="bg-rose-600 hover:bg-rose-700 text-white">
                    + Novo Usuário
                </Button>
            </div>

            <div className="grid gap-4">
                {users.map((user) => (
                    <Card key={user.id} className="flex items-center justify-between p-6 bg-slate-900/50 border-slate-800">
                        <div>
                            <p className="font-semibold text-white">{user.name}</p>
                            <p className="text-sm text-slate-500">@{user.username}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-xs text-slate-500">
                                {user.accesses.length} módulos liberados
                            </span>
                            <Button variant="secondary" onClick={() => setSelectedUser(user)}>
                                Gerenciar Acesso
                            </Button>
                            <Button variant="ghost" onClick={() => handleDelete(user.id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 text-sm px-3 py-1.5">
                                Excluir
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Register Modal */}
            {isRegisterOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl bg-slate-950 border border-slate-800 p-6 shadow-2xl">
                        <h2 className="mb-4 text-xl font-bold text-white">Novo Usuário</h2>
                        <form action={handleRegister} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Nome</label>
                                <Input name="name" required placeholder="Nome completo" className="bg-slate-900 border-slate-800" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Usuário</label>
                                <Input name="username" required placeholder="usuario.login" className="bg-slate-900 border-slate-800" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Email (Opcional)</label>
                                <Input name="email" type="email" placeholder="email@empresa.com" className="bg-slate-900 border-slate-800" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Senha</label>
                                <Input name="password" type="password" required placeholder="******" className="bg-slate-900 border-slate-800" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Função</label>
                                <select
                                    name="role"
                                    className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-white"
                                >
                                    <option value="EMPLOYEE">Membro (Funcionário)</option>
                                    <option value="ADMIN">Administrador</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button type="button" variant="ghost" onClick={() => setIsRegisterOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={isLoading} className="bg-rose-600 hover:bg-rose-700 text-white">
                                    {isLoading ? "Salvando..." : "Cadastrar"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Access Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-2xl bg-slate-950 border border-slate-800 p-6 shadow-2xl">
                        <h2 className="mb-2 text-xl font-bold text-white">Acessos: {selectedUser.name}</h2>
                        <p className="mb-6 text-sm text-slate-400">Selecione os módulos que este usuário pode visualizar.</p>

                        <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                            {modules.map((module) => {
                                const hasAccess = selectedUser.accesses.some((a) => a.moduleId === module.id);
                                return (
                                    <label
                                        key={module.id}
                                        className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${hasAccess
                                            ? "border-emerald-500/50 bg-emerald-500/10"
                                            : "border-slate-800 bg-slate-900/50 hover:bg-slate-900"
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            className="h-5 w-5 rounded border-slate-700 bg-slate-900 text-rose-600 focus:ring-rose-600"
                                            checked={hasAccess}
                                            onChange={(e) => handleToggleAccess(module.id, e.target.checked)}
                                        />
                                        <span className={hasAccess ? "text-white" : "text-slate-400"}>
                                            {module.title}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <Button onClick={() => setSelectedUser(null)}>Fechar</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
