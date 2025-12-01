export type Metric = {
  id: number;
  title: string;
  value: string;
  change: string;
  direction: "up" | "down";
  comparisonText: string;
};
