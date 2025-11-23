import { siteConfig } from "@/config/site";

export const navLinks = {
  admin: [
    { label: "Módulos", href: "/admin" },
    { label: "Usuários", href: "/admin/users" },
  ],
  employee: [
    { label: "Meus Cursos", href: "/employee" },
  ],
  member: [
    { label: "Meus Cursos", href: "/members" },
  ],
};

export const footerNote = `© ${new Date().getFullYear()} ${siteConfig.companyName}. Todos os direitos reservados.`;
