import { getUsersWithAccess } from "@/controllers/userController";
import { getAllModules } from "@/controllers/moduleController";
import { UserManagementView } from "@/views/admin/user-management-view";

export default async function UsersPage() {
    const [users, modules] = await Promise.all([
        getUsersWithAccess(),
        getAllModules(),
    ]);

    return <UserManagementView users={users} modules={modules} />;
}
