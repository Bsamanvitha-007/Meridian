export type AlgorithmSection = 
  | 'overview'
  | 'queens'
  | 'hamiltonian'
  | 'tsp'
  | 'knapsack'
  | 'dashboard'
  | 'comparison'
  | 'architecture'
  | 'viva';

// 8-Queens Types
export interface QueensStep {
  row: number;
  col: number;
  action: 'try' | 'place' | 'conflict' | 'backtrack' | 'solution';
  board: number[]; // col position for each row (-1 if unplaced)
  message: string;
  attackedCells?: [number, number][];
}

export interface QueensState {
  board: number[]; // index = row, value = col
  solutions: number[][];
  currentSolutionIndex: number;
  isSolving: boolean;
  isPaused: boolean;
  exploredStates: number;
  rejectedStates: number;
  currentStepIndex: number;
  steps: QueensStep[];
  manualMode: boolean;
}

// Hamiltonian Cycle Types
export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface HamiltonianStep {
  position: number;
  vertex: number;
  action: 'visit' | 'reject' | 'backtrack' | 'complete';
  currentPath: number[];
  message: string;
  rejectedEdge?: [number, number];
}

export interface HamiltonianState {
  nodes: GraphNode[];
  adjMatrix: number[][];
  startVertex: number;
  isSolving: boolean;
  isPaused: boolean;
  currentPath: number[];
  cycleFound: boolean | null;
  finalCycle: number[];
  exploredStates: number;
  rejectedStates: number;
  currentStepIndex: number;
  steps: HamiltonianStep[];
}

// TSP Types
export interface Airport {
  id: string;
  name: string;
  code: string;
  state: string;
  x: number;
  y: number;
}

export interface TSPNode {
  id: number;
  level: number;
  path: number[];
  bound: number;
  cost: number;
  status: 'active' | 'pruned' | 'optimal' | 'explored';
  reason?: string;
}

export interface TSPStep {
  nodeId: number;
  action: 'expand' | 'prune' | 'update_best';
  activeNode: TSPNode;
  currentBestCost: number;
  currentBestPath: number[];
  queueSize: number;
  message: string;
}

export interface TSPState {
  airports: Airport[];
  costMatrix: number[][];
  startAirport: number;
  isSolving: boolean;
  isPaused: boolean;
  optimalPath: number[];
  optimalCost: number | null;
  baselineCost: number | null;
  baselinePath: number[];
  expandedNodes: number;
  prunedNodes: number;
  exploredTree: TSPNode[];
  currentStepIndex: number;
  steps: TSPStep[];
}

// Knapsack Types
export interface ProjectItem {
  id: string;
  name: string;
  cost: number; // in ₹ Lakhs
  expectedReturn: number; // in ₹ Lakhs
  ratio: number; // return / cost
}

export interface KnapsackNode {
  id: number;
  level: number;
  weight: number;
  profit: number;
  bound: number;
  decision: 'include' | 'exclude' | 'root';
  path: boolean[];
  status: 'active' | 'pruned' | 'optimal' | 'infeasible' | 'explored';
  reason?: string;
}

export interface KnapsackStep {
  nodeId: number;
  action: 'expand' | 'prune' | 'infeasible' | 'update_best';
  activeNode: KnapsackNode;
  bestProfit: number;
  bestSelection: boolean[];
  message: string;
}

export interface KnapsackState {
  projects: ProjectItem[];
  budget: number; // in ₹ Lakhs
  isSolving: boolean;
  isPaused: boolean;
  optimalSelection: boolean[];
  optimalCost: number;
  optimalReturn: number;
  baselineReturn: number;
  baselineSelection: boolean[];
  expandedNodes: number;
  prunedNodes: number;
  treeNodes: KnapsackNode[];
  currentStepIndex: number;
  steps: KnapsackStep[];
}

// Dashboard Aggregation
export interface DashboardSummary {
  queens: {
    status: string;
    totalSolutions: number;
    exploredStates: number;
    rejectedStates: number;
  };
  hamiltonian: {
    cycleFound: boolean | null;
    cycleSequence: string;
    exploredStates: number;
    rejectedStates: number;
  };
  tsp: {
    optimalCost: number | null;
    baselineCost: number | null;
    expandedNodes: number;
    prunedNodes: number;
    costReductionPercent: number;
  };
  knapsack: {
    optimalReturn: number;
    baselineReturn: number;
    investedCost: number;
    remainingBudget: number;
    prunedNodes: number;
    efficiencyGainPercent: number;
  };
}
