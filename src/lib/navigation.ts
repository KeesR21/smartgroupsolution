export const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Pillars", href: "#pillars" },
  { label: "Services", href: "#services" },
  { label: "Impact", href: "#impact" },
  { label: "Industries", href: "#industries" },
  { label: "Team", href: "#team" },
  { label: "Contact", href: "#contact" },
] as const;

export const ADMIN_NAV = [
  { label: "Overview", href: "/admin", icon: "LayoutDashboard" },
  { label: "Services", href: "/admin/services", icon: "Briefcase" },
  { label: "Content", href: "/admin/content", icon: "FileText" },
  { label: "Team", href: "/admin/team", icon: "Users" },
  { label: "Messages", href: "/admin/messages", icon: "Mail" },
  { label: "Profile", href: "/admin/profile", icon: "Settings2" },
] as const;
