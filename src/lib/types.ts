export type SortStep = {
  array: number[];
  compare?: [number, number];
  swap?: [number, number];
  overwrite?: number;
  sortedIndices: number[];
  description: string;
  codeLine: number;
};

export type SortAlgorithmId =
  | "bubble"
  | "selection"
  | "insertion"
  | "merge"
  | "quick";

export type SortResult = {
  steps: SortStep[];
  comparisons: number;
  swaps: number;
};
