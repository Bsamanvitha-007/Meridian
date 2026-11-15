import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Sparkles,
  BookOpen,
  Award,
  Layers,
  CheckCircle,
  HelpCircle as QuestionIcon,
} from 'lucide-react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  keyTakeaway: string;
}

export const VivaSection: React.FC = () => {
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);
  const [practiceMode, setPracticeMode] = useState<boolean>(false);
  const [revealedCards, setRevealedCards] = useState<Record<number, boolean>>({});

  const toggleAccordion = (idx: number) => {
    setOpenAccordion(openAccordion === idx ? null : idx);
  };

  const toggleCardReveal = (id: number) => {
    setRevealedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const vivaQuestions: FAQItem[] = [
    {
      id: 1,
      question: 'What is Backtracking?',
      answer:
        'Backtracking is a systematic algorithmic technique for solving constraint-satisfaction problems by incrementally building a candidate solution vector component by component. At each stage, if the partial candidate violates problem constraints, the algorithm immediately abandons that branch ("backtracks") to the nearest decision junction and tests alternate choices.',
      keyTakeaway: 'Depth-first search with early constraint pruning.',
    },
    {
      id: 2,
      question: 'What is Branch and Bound?',
      answer:
        'Branch and Bound is a state-space search algorithm specifically designed for combinatorial optimization problems. It partitions the solution domain into smaller subproblems ("branching") and computes optimistic bounds (lower bounds for minimization, upper bounds for maximization). It terminates or prunes subtrees whose bounds prove they cannot mathematically beat the best complete solution found so far (the incumbent).',
      keyTakeaway: 'Optimization search using bounding functions to prune sub-optimal subtrees.',
    },
    {
      id: 3,
      question: 'What is the fundamental difference between Backtracking and Branch and Bound?',
      answer:
        'Backtracking is primarily intended for constraint-satisfaction and feasibility search (finding one or all valid arrangements), traditionally using Depth-First Search with $O(\\text{depth})$ memory. Branch and Bound is strictly an optimization strategy (finding the global minimum or maximum), typically employing Best-First Search with a Priority Queue and pruning nodes based on objective value bounds rather than feasibility alone.',
      keyTakeaway: 'Backtracking prunes infeasible states; Branch and Bound prunes sub-optimal states.',
    },
    {
      id: 4,
      question: 'What is a state-space tree?',
      answer:
        'A state-space tree is an abstract hierarchical tree structure representing all possible configurations of a problem. The root corresponds to the initial unassigned state, each intermediate node represents a partial assignment, edges denote decision choices, and leaves correspond to complete candidate solutions (either valid or invalid).',
      keyTakeaway: 'Hierarchical tree model of all partial and complete candidate solutions.',
    },
    {
      id: 5,
      question: 'What is a promising node versus a non-promising node?',
      answer:
        'A promising node is a state-space tree node that satisfies all feasibility constraints and has a bounding estimate indicating it could potentially yield a valid or superior optimal solution. A non-promising node either violates problem constraints or possesses a bound worse than the current incumbent; such nodes are pruned immediately.',
      keyTakeaway: 'Promising nodes warrant expansion; non-promising nodes are pruned.',
    },
    {
      id: 6,
      question: 'What is the difference between pruning and bounding?',
      answer:
        'Bounding is the calculation of an optimistic numeric estimate (e.g., lower bound on tour cost or upper bound on knapsack profit) of what any complete solution descendant from a partial node could achieve. Pruning is the deliberate action of discarding a node and its entire subtree so that it is never expanded further.',
      keyTakeaway: 'Bounding computes the numeric estimate; pruning discards unviable branches based on that estimate.',
    },
    {
      id: 7,
      question: 'Why is the 8-Queens problem solved using Backtracking instead of Branch and Bound?',
      answer:
        'The 8-Queens problem is a classic constraint-satisfaction problem where any arrangement that satisfies all non-attacking row, column, and diagonal constraints is an equally valid solution. There is no numerical objective function to minimize or maximize; hence, bounding functions are irrelevant and recursive Backtracking is the natural and optimal design choice.',
      keyTakeaway: 'No objective function exists to optimize; only feasibility constraints must be satisfied.',
    },
    {
      id: 8,
      question: 'What is a Hamiltonian Cycle and why is finding it NP-complete?',
      answer:
        'A Hamiltonian Cycle in an undirected graph $G = (V, E)$ is a closed loop that visits every vertex $v \\in V$ exactly once and returns to the origin. Determining the existence of a Hamiltonian Cycle is one of Karp’s classic 21 NP-complete problems because verifying a given cycle takes polynomial time $O(V)$, but finding one requires exploring up to $O(V!)$ permutations in the worst case.',
      keyTakeaway: 'Closed cycle visiting all vertices once; NP-complete decision problem.',
    },
    {
      id: 9,
      question: 'Why is the Traveling Salesperson Problem (TSP) computationally expensive?',
      answer:
        'For an $n$-city symmetric TSP, the number of distinct tours is $\\frac{(n-1)!}{2}$. As $n$ grows, this factorial growth creates an astronomical combinatorial explosion (e.g., for $n=20$, there are $\\approx 6 \\times 10^{16}$ tours). Branch and Bound drastically reduces states on average instances, but the worst-case complexity remains factorial $O(n!)$ because an adversarial cost matrix could force expansion of the entire tree.',
      keyTakeaway: 'Factorial permutation growth $(n-1)! / 2$ causes combinatorial explosion.',
    },
    {
      id: 10,
      question: 'What makes a lower bound "admissible" in Branch and Bound for TSP?',
      answer:
        'A lower bound is admissible if it is guaranteed to never overestimate the actual minimum cost to complete a partial tour ($LB(x) \\le \\text{Cost}^*(x)$). The Minimum Spanning Tree (MST) on unvisited vertices plus minimum endpoint connections is admissible because every valid TSP tour contains a spanning tree on the unvisited vertices; hence, the MST cost can never exceed the tour segments.',
      keyTakeaway: 'Admissibility guarantees the bound never overestimates the true remaining cost.',
    },
    {
      id: 11,
      question: 'How does the Fractional Knapsack relaxation yield a valid upper bound for 0/1 Knapsack?',
      answer:
        'The continuous Fractional Knapsack problem relaxes the binary constraint $x_i \\in \\{0, 1\\}$ to allow fractional items $x_i \\in [0, 1]$. Because the feasible solution space of the fractional relaxation strictly contains the discrete integer solution space ($S_{\\text{integer}} \\subset S_{\\text{fractional}}$), the maximum profit achievable under the relaxation is always greater than or equal to the optimal integer profit ($UB_{\\text{frac}} \\ge P^*$).',
      keyTakeaway: 'Relaxed continuous problem strictly upper-bounds the discrete integer problem.',
    },
    {
      id: 12,
      question: 'What are the practical limitations of Backtracking and Branch and Bound in real-world systems?',
      answer:
        'In the worst case, both techniques still exhibit exponential or factorial time complexity if pruning is ineffective or if all bounding estimates remain close to the optimum. Additionally, best-first Branch and Bound requires storing active states in a priority queue, which can exhaust system memory ($O(2^n)$ or $O(n!)$ space). For ultra-large industrial instances, engineers frequently combine Branch and Bound with approximation algorithms or metaheuristics (e.g., Genetic Algorithms, Simulated Annealing).',
      keyTakeaway: 'Worst-case exponential time, potential memory exhaustion in priority queues.',
    },
  ];

  return (
    <section id="viva" className="py-20 border-b border-slate-800/60 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            Section 10 · Academic Synthesis
          </div>
          <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Conclusion & Viva Examination Preparation
          </h2>
          <p className="mt-4 text-xs sm:text-base text-slate-300 leading-relaxed">
            Consolidate your conceptual understanding of combinatorial search algorithms. Review key learning outcomes,
            explore standard university viva questions, or activate Viva Practice Flashcard Mode to test your recall.
          </p>
        </div>

        {/* 4 Key Learning Outcome Cards */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3">
              <BookOpen className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-semibold text-slate-100">1. Recursive Problem Solving</h4>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Formulating complex constraints as recursive state-space trees where choices are made step-by-step
              and unwound gracefully upon dead-ends.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
              <CheckCircle className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-semibold text-slate-100">2. Constraint Checking & Feasibility</h4>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Evaluating local invariants (diagonal lines of sight, circuit adjacency) early in the tree to eliminate
              exponential non-viable subtrees before expansion.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3">
              <Layers className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-semibold text-slate-100">3. Lower Bounds & Pruning Mechanics</h4>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Designing admissible mathematical relaxations (MST for TSP, fractional relaxation for Knapsack)
              that guarantee true global optimality while pruning sub-optimal branches.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3">
              <Award className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-semibold text-slate-100">4. Optimization & Incumbent Tracking</h4>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Maintaining an active incumbent complete solution to dynamically raise the bar, enabling
              progressively sharper pruning cuts across priority queues.
            </p>
          </div>
        </div>

        {/* Viva Preparation Suite Header with Practice Mode Toggle */}
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-2.5">
            <GraduationCap className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">
              Curated Viva Examination Q&A Repository (12 Questions)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPracticeMode(!practiceMode)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                practiceMode
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{practiceMode ? 'Standard Accordion Mode' : 'Interactive Flashcard Quiz Mode'}</span>
            </button>
          </div>
        </div>

        {/* Questions Accordion or Flashcard Mode */}
        {!practiceMode ? (
          <div className="mt-6 space-y-3">
            {vivaQuestions.map((q, idx) => {
              const isOpen = openAccordion === idx;
              return (
                <div
                  key={q.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-slate-900/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-md bg-slate-800 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                        {q.id}
                      </span>
                      <span className="text-sm font-semibold text-slate-100">{q.question}</span>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="p-4 pt-0 border-t border-slate-800/60 text-xs text-slate-300 leading-relaxed space-y-3">
                      <p>{q.answer}</p>
                      <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">
                          Viva Summary:
                        </span>
                        <span className="text-slate-200 font-medium">{q.keyTakeaway}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* Flashcard Quiz Mode */
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vivaQuestions.map((q) => {
              const isRevealed = revealedCards[q.id];
              return (
                <div
                  key={q.id}
                  className="p-5 rounded-xl border border-slate-800 bg-slate-900/50 flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                      <span>QUESTION #{q.id}</span>
                      <span className="text-cyan-400 font-semibold">TEST RECALL</span>
                    </div>
                    <h4 className="mt-2 text-sm font-bold text-slate-100 leading-snug">
                      {q.question}
                    </h4>
                  </div>

                  {isRevealed ? (
                    <div className="p-3 rounded-lg bg-slate-950 border border-cyan-800/40 text-xs text-slate-300 space-y-2">
                      <p>{q.answer}</p>
                      <div className="text-[10px] text-cyan-400 font-mono font-semibold pt-1 border-t border-slate-800">
                        Takeaway: {q.keyTakeaway}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg bg-slate-950/40 border border-dashed border-slate-800 text-center text-xs text-slate-500">
                      Answer hidden. Formulate your verbal response, then click reveal.
                    </div>
                  )}

                  <button
                    onClick={() => toggleCardReveal(q.id)}
                    className="w-full py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                  >
                    {isRevealed ? 'Hide Answer' : 'Reveal Model Answer'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
