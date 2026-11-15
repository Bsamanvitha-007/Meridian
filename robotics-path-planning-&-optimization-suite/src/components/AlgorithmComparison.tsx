import React from 'react';
import { Table, Zap, Layers, Cpu, ShieldCheck } from 'lucide-react';

export const AlgorithmComparison: React.FC = () => {
  const comparisonData = [
    {
      algorithm: '8-Queens Placement',
      type: 'Constraint Satisfaction',
      realWorld: 'Robotics Collision Avoidance & Sensor Grid Layout',
      technique: 'Recursive Backtracking (Depth-First)',
      pruning: 'Row & Diagonal conflict detection (Laser line-of-sight checks)',
      timeComplexity: 'O(N!) worst-case',
      spaceComplexity: 'O(N) auxiliary',
      highlightColor: 'text-cyan-400',
    },
    {
      algorithm: 'Hamiltonian Cycle',
      type: 'Graph Connectivity / Path',
      realWorld: 'Printed Circuit Board (PCB) Bus Wire Traversal',
      technique: 'Recursive Backtracking (DFS on Adjacency Matrix)',
      pruning: 'No edge exists, or vertex already visited in active circuit loop',
      timeComplexity: 'O(V!) worst-case',
      spaceComplexity: 'O(V) auxiliary',
      highlightColor: 'text-emerald-400',
    },
    {
      algorithm: 'Traveling Salesperson (TSP)',
      type: 'Combinatorial Optimization (Min)',
      realWorld: 'Multi-City Airline Cargo Routing & Fuel Minimization',
      technique: 'Branch & Bound (Best-First Search via Priority Queue)',
      pruning: 'Admissible Minimum Spanning Tree (MST) lower bound ≥ current best tour',
      timeComplexity: 'O(n!) worst-case',
      spaceComplexity: 'O(n!) worst-case search queue storage',
      highlightColor: 'text-blue-400',
    },
    {
      algorithm: '0/1 Knapsack Portfolio',
      type: 'Subset Optimization (Max)',
      realWorld: 'Capital Budgeting & Indivisible Project Selection',
      technique: 'Branch & Bound (Best-First Search on Value/Weight Ratio)',
      pruning: 'Fractional Knapsack upper bound ≤ established integer return, or weight > budget',
      timeComplexity: 'O(2ⁿ) worst-case (+ O(n log n) sorting)',
      spaceComplexity: 'O(2ⁿ) worst-case search tree storage',
      highlightColor: 'text-amber-400',
    },
  ];

  return (
    <section id="comparison" className="py-20 border-b border-slate-800/60 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            Section 8 · Algorithmic Matrix
          </div>
          <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Comprehensive Algorithm Comparison Matrix
          </h2>
          <p className="mt-4 text-xs sm:text-base text-slate-300 leading-relaxed">
            Side-by-side technical evaluation contrasting problem formulations, pruning heuristics,
            and computational complexities across all four core algorithmic engines.
          </p>
        </div>

        {/* 7-Column Academic Comparison Table */}
        <div className="mt-10 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40 shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-4 px-4 font-semibold">Algorithm</th>
                <th className="py-4 px-4 font-semibold">Problem Type</th>
                <th className="py-4 px-4 font-semibold">Real-World Application</th>
                <th className="py-4 px-4 font-semibold">Core Technique</th>
                <th className="py-4 px-4 font-semibold">Pruning Strategy</th>
                <th className="py-4 px-4 font-semibold text-rose-400">Time Complexity</th>
                <th className="py-4 px-4 font-semibold text-cyan-400">Space Complexity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {comparisonData.map((row) => (
                <tr key={row.algorithm} className="hover:bg-slate-800/30 transition-colors">
                  <td className={`py-4 px-4 font-bold ${row.highlightColor} whitespace-nowrap`}>
                    {row.algorithm}
                  </td>
                  <td className="py-4 px-4 font-medium text-slate-200">{row.type}</td>
                  <td className="py-4 px-4 text-slate-300 leading-relaxed">{row.realWorld}</td>
                  <td className="py-4 px-4 text-slate-400 font-mono text-[11px]">{row.technique}</td>
                  <td className="py-4 px-4 text-slate-300 leading-relaxed">{row.pruning}</td>
                  <td className="py-4 px-4 font-mono font-bold text-rose-300 whitespace-nowrap">
                    {row.timeComplexity}
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-cyan-300 whitespace-nowrap">
                    {row.spaceComplexity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Analytical Notes */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              Instance-Dependent Pruning
            </span>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              While worst-case time complexity remains factorial $O(N!)$ or exponential $O(2^n)$, empirical execution times
              on practical instances drop by orders of magnitude due to early cut-offs near the tree root.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Admissibility Guarantee
            </span>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              In Branch & Bound, the bounding function must be admissible (never underestimate costs or overestimate profits).
              Relaxations such as MST for TSP and Fractional Knapsack guarantee that no globally optimal solution is accidentally pruned.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              Memory Trade-Offs
            </span>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              Backtracking uses depth-first exploration with strict O(depth) memory on the stack, whereas best-first Branch & Bound
              stores active nodes in a priority queue, consuming higher space in exchange for expanding fewer sub-optimal nodes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
