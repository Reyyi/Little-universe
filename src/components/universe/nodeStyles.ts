import type { NodeState } from "@/lib/progress";

export const nodeColor: Record<NodeState, string> = {
  locked: "#5a5260",
  available: "#ebcfd5",
  completed: "#c8ad7d",
  secret: "#3a3440",
};

export const nodeLabel: Record<NodeState, string> = {
  locked: "Locked",
  available: "Open",
  completed: "Visited",
  secret: "Hidden",
};
