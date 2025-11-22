'use server';

import { createUser, deleteUser } from "@/controllers/userController";
import { grantAccess, revokeAccess } from "@/controllers/accessController";
import { revalidatePath } from "next/cache";

export async function registerUserAction(formData: FormData) {
    const name = formData.get("name") as string;
    const username = formData.get("username") as string;
    const email = formData.get("email") as string; // Optional
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;

    if (!name || !username || !password) {
        return { error: "Nome, usuário e senha são obrigatórios." };
    }

    try {
        await createUser({ name, username, email, password, role });
        revalidatePath("/admin/users");
        return { success: true };
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        return { error: "Erro ao criar usuário. Verifique se o usuário já existe." };
    }
}

export async function deleteUserAction(userId: string) {
    try {
        await deleteUser(userId);
        revalidatePath("/admin/users");
        return { success: true };
    } catch (error) {
        console.error("Erro ao excluir usuário:", error);
        return { error: "Erro ao excluir usuário." };
    }
}

export async function toggleModuleAccessAction(userId: string, moduleId: string, hasAccess: boolean) {
    try {
        if (hasAccess) {
            await grantAccess({ userId, moduleId });
        } else {
            await revokeAccess({ userId, moduleId });
        }
        revalidatePath("/admin/users");
        return { success: true };
    } catch (error) {
        console.error("Erro ao atualizar acesso:", error);
        return { error: "Erro ao atualizar acesso." };
    }
}
