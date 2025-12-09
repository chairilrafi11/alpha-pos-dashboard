import { BadgeColor } from "@/components/ui/badge/Badge";

export function getGenderBadgeColor(gender: string): BadgeColor {
  switch (gender) {
    case "L":
      return "info";
    case "P":
      return "warning";
    default:
      return "dark";
  }
}
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

export function getOrderWorkflowBadgeColor(workflowName: string): BadgeColor {
  switch (workflowName) {
    case "inputed order":
      return "info";
    case "kitchen":
      return "primary";
    case "delivered":
      return "warning";
    case "invoiced":
      return "success";
    default:
      return "dark";
  }
}

export function getOrderStatusBadgeColor(status: string): BadgeColor {
  switch (status) {
    case "processing":
      return "info";
    case "canceled":
      return "error";
    case "closed":
      return "success";
    default:
      return "dark";
  }
}

export function getShiftingStatusBadgeColor(status: string): BadgeColor {
  switch (status) {
    case 'IN':
      return "primary";
    case "OUT":
      return "success";
    default:
      return "dark";
  }
}