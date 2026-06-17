import {
  LayoutDashboard,
  Syringe,
  Boxes,
  Building2,
  MapPinned,
  Users,
  FileBarChart,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const navItems: NavItem[] = [
  { title: "Overview", href: "/", icon: LayoutDashboard },
  { title: "Vaccinations", href: "/vaccinations", icon: Syringe },
  { title: "Vaccines", href: "/vaccines", icon: Boxes },
  { title: "Facilities", href: "/facilities", icon: Building2 },
  { title: "Geography", href: "/geography", icon: MapPinned },
  { title: "Demographics", href: "/demographics", icon: Users },
  { title: "Reports", href: "/reports", icon: FileBarChart },
];
