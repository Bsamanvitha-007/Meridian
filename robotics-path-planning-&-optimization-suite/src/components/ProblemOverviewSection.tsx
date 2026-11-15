import React from 'react';
import { Bot, Cpu, Plane, TrendingUp, GitFork, CheckCircle2, XCircle, Search, ShieldCheck } from 'lucide-react';

export const ProblemOverviewSection: React.FC = () => {
  return (
    <section className="py-20 border-b border-slate-800/60 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            Domain Applications & Theoretical Foundations
          </div>
          <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Real-World Problem Scenarios & Algorithmic Paradigms
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
            Many critical engineering challenges belong to the class of NP-hard combinatorial problems.
            Exhaustive brute-force search quickly results in combinatorial explosion.
            Backtracking and Branch & Bound provide systematic strategies to prune infeasible or sub-optimal
            regions of the solution space without compromising correctness.
          </p>
        </div>

        {/* 4 Problem Domain Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* A. Robotics Path Planning */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono text-cyan-400">Case Study A</span>
                <h3 className="text-lg font-semibold text-slate-100">Robotics Path Planning & Sensor Placement</h3>
              </div>
            </div>
            <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Autonomous mobile robots must navigate dynamic grids while avoiding stationary and moving obstacles.
              When placing multiple stationary sensing drones or sensor towers, the spatial arrangement must prevent
              mutual line-of-sight laser blinding, radio frequency interference, or collision zones.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800/60 space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">·</span>
                <span><strong className="text-slate-200">Constraint Satisfaction:</strong> No two sensors share the same row, column, or diagonal line-of-sight.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">·</span>
                <span><strong className="text-slate-200">Algorithmic Fit:</strong> Backtracking systematically places robots row-by-row, immediately abandoning conflicts before continuing downward.</span>
              </div>
            </div>
          </div>

          {/* B. PCB Design Using Hamiltonian Cycle */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-emerald-500/30 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono text-emerald-400">Case Study B</span>
                <h3 className="text-lg font-semibold text-slate-100">PCB Integrated Circuit Connectivity</h3>
              </div>
            </div>
            <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              On complex multi-layer printed circuit boards, high-speed serial bus lines or diagnostic testing loops
              must connect a sequence of microchips and return to the primary controller without duplicate component visits.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800/60 space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">·</span>
                <span><strong className="text-slate-200">Graph Model:</strong> Components represent vertices $V$; conductive copper routing channels represent edges $E$.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">·</span>
                <span><strong className="text-slate-200">Theoretical Clarification:</strong> While a Hamiltonian cycle guarantees topological connectivity, physical manufacturing also requires geometric track spacing and layer-via constraints.</span>
              </div>
            </div>
          </div>

          {/* C. Airline Cargo Routing */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-blue-500/30 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Plane className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono text-blue-400">Case Study C</span>
                <h3 className="text-lg font-semibold text-slate-100">Airline Cargo Multi-City Logistics</h3>
              </div>
            </div>
            <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              A cargo carrier operating freight aircraft between major industrial airports must visit each destination
              exactly once to deliver freight containers and return to the main maintenance base with minimum total fuel expenditure and flight delay risk.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800/60 space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">·</span>
                <span><strong className="text-slate-200">Mathematical Model:</strong> Symmetric Traveling Salesperson Problem (TSP) with $n=5$ cities (120 permutations).</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">·</span>
                <span><strong className="text-slate-200">Bounding Strategy:</strong> Admissible MST lower bounds eliminate entire subtrees whose optimistic cost exceeds an existing complete flight route.</span>
              </div>
            </div>
          </div>

          {/* D. Investment Portfolio Optimization */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-amber-500/30 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono text-amber-400">Case Study D</span>
                <h3 className="text-lg font-semibold text-slate-100">Capital Budgeting & Project Selection</h3>
              </div>
            </div>
            <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              An engineering enterprise evaluating high-impact robotics R&D projects operates under a strict budget ceiling
              of ₹12 Lakhs. Each candidate initiative incurs a capital requirement and yields a quantified expected return.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800/60 space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">·</span>
                <span><strong className="text-slate-200">Binary 0/1 Choice:</strong> A project must be funded in its entirety or declined (binary decision x<sub>i</sub> &isin; &#123;0, 1&#125;).</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">·</span>
                <span><strong className="text-slate-200">Bounding Strategy:</strong> Continuous fractional knapsack relaxation calculates an admissible upper bound to prune non-viable branches.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Backtracking vs Branch and Bound: In-Depth Comparison */}
        <div className="mt-16 p-8 rounded-2xl bg-slate-900/50 border border-slate-800">
          <div className="max-w-3xl">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Algorithmic Philosophy</span>
            <h3 className="mt-1 text-xl sm:text-2xl font-bold text-slate-100">
              Why Backtracking and Branch & Bound?
            </h3>
            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Both techniques systematically traverse a state-space tree, but their pruning criteria and traversal
              philosophies target different problem categories.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Backtracking Principle */}
            <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
                <GitFork className="w-4 h-4" />
                <span>Backtracking Paradigm</span>
              </div>
              <ul className="mt-3 space-y-2.5 text-xs text-slate-300 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Incremental Construction:</strong> Extends a candidate vector $X = (x_1, x_2, \dots, x_k)$ one component at a time.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Constraint Satisfaction:</strong> Evaluates a bounding predicate $P(x_1, \dots, x_k)$. If violated, choices are rejected immediately.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Depth-First Traversal:</strong> Follows a branch down to a dead end, then backtracks up the stack to test alternate siblings.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Memory Efficiency:</strong> Auxiliary storage is strictly proportional to tree depth $O(N)$ or $O(V)$.</span>
                </li>
              </ul>
            </div>

            {/* Branch and Bound Principle */}
            <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>Branch and Bound Paradigm</span>
              </div>
              <ul className="mt-3 space-y-2.5 text-xs text-slate-300 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Optimization Target:</strong> Seeks an extreme value (minimizing travel cost or maximizing portfolio profit).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Heuristic Bounding Function:</strong> Computes optimistic lower bounds (minimization) or upper bounds (maximization) for partial states.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Best-First Search (Priority Queue):</strong> Expands the most promising node globally, maintaining an incumbent best complete solution.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Sub-Optimal Pruning:</strong> Eliminates branches whose bounding estimate cannot mathematically beat the current incumbent.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Formal Comparison Table */}
          <div className="mt-8 overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-mono uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Feature</th>
                  <th className="py-3 px-4 text-cyan-400">Backtracking</th>
                  <th className="py-3 px-4 text-emerald-400">Branch and Bound</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-slate-300">
                <tr className="hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-semibold text-slate-200">Primary Objective</td>
                  <td className="py-3 px-4">Constraint satisfaction, enumeration, or existence proof</td>
                  <td className="py-3 px-4">Global optimization (minimization or maximization)</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-semibold text-slate-200">Search Strategy</td>
                  <td className="py-3 px-4">Depth-First Search (DFS) with recursion stack</td>
                  <td className="py-3 px-4">Best-First Search (Priority Queue) or Breadth-First</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-semibold text-slate-200">Pruning Criterion</td>
                  <td className="py-3 px-4">Violated constraints (infeasible partial solutions)</td>
                  <td className="py-3 px-4">Bounding estimate cannot beat incumbent complete solution</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-semibold text-slate-200">Evaluated Problems</td>
                  <td className="py-3 px-4">8-Queens Collision Placement, Hamiltonian PCB Cycle</td>
                  <td className="py-3 px-4">Airline Cargo TSP, Capital Investment Knapsack</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-semibold text-slate-200">Optimality Guarantee</td>
                  <td className="py-3 px-4">Finds valid solutions; exhaustive search finds all valid states</td>
                  <td className="py-3 px-4">Guarantees mathematically global optimal with admissible bounds</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Core Theoretical Terminology */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/70">
              <span className="text-xs font-mono text-cyan-400">01. State-Space Tree</span>
              <p className="mt-1 text-xs text-slate-400">
                A hierarchical directed tree whose root represents the unassigned problem and paths from root to leaves represent candidate solutions.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/70">
              <span className="text-xs font-mono text-emerald-400">02. Promising Nodes</span>
              <p className="mt-1 text-xs text-slate-400">
                Nodes that satisfy all constraints and whose bounding estimate indicates potential to produce or improve an optimal solution.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/70">
              <span className="text-xs font-mono text-rose-400">03. Pruning Mechanism</span>
              <p className="mt-1 text-xs text-slate-400">
                The immediate termination of exploration for a subtree when feasibility fails or its bound proves it cannot match the best-known solution.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/70">
              <span className="text-xs font-mono text-amber-400">04. Admissible Bounds</span>
              <p className="mt-1 text-xs text-slate-400">
                A bounding function that never overestimates cost (minimization) or never underestimates profit (maximization), guaranteeing optimality.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
