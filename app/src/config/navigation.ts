import { siteConfig } from "@/config/site";

export const navLinks = {
  admin: [
    { label: "Módulos", href: "/admin" },
    { label: "Usuários", href: "/admin/users" },
  ],
  employee: [
    { label: "Início", href: "/employee" },
    { label: "Módulos", href: "/employee" },
    { label: "Área de membros", href: "/members" },
  ],
  member: [
    { label: "Meus Cursos", href: "/members" },
  ],
};

export const footerNote = `© ${new Date().getFullYear()} ${siteConfig.companyName}. Todos os direitos reservados.`;
