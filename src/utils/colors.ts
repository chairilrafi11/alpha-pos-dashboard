import { BadgeColor } from "@/components/ui/badge/Badge";

export function getRoleBadgeColor(roleId: number): BadgeColor {
  switch (roleId) {
    case 1:
      return "light"; 
    case 2:
      return "primary"; 
    case 3:
      return "info";
    case 4:
      return "success"; 
    case 5:
      return "warning"; 
    case 6:
      return "dark"; 
    default:
      return "dark";
  }
}