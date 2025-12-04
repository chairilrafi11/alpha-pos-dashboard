export function getShiftingStatusName(status: string): string {
  switch (status) {
    case 'IN':
      return "open";
    case "OUT":
      return "closed";
    default:
      return "-";
  }
}