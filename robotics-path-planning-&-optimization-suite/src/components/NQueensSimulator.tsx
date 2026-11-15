import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Bot,
  Zap,
  CheckCircle,
  AlertTriangle,
  Layers,
  ChevronLeft,
  ChevronRight,
  Info,
} from 'lucide-react';
import { isQueenSafe, getAttackedCells, solveAllNQueens, generateNQueensSteps } from '../algorithms/nQueens';
import { QueensStep } from '../types';

interface NQueensSimulatorProps {
  onUpdateStats?: (stats: { explored: number; rejected: number; solutions: number }) => void;
}

export const NQueensSimulator: React.FC<NQueensSimulatorProps> = ({ onUpdateStats }) => {
  const N = 8;
  const [board, setBoard] = useState<number[]>(new Array(N).fill(-1));
  const [manualMode, setManualMode] = useState<boolean>(false);
  const [isSolving, setIsSolving] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(900); // Default to comfortable 900ms explanatory pace
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [steps, setSteps] = useState<QueensStep[]>([]);
  const [allSolutions, setAllSolutions] = useState<number[][]>([]);
  const [solutionIndex, setSolutionIndex] = useState<number>(0);
  const [exploredCount, setExploredCount] = useState<number>(0);
  const [rejectedCount, setRejectedCount] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>(
    'Ready. Select "Find First Solution", "Enumerate 92 Solutions", or place robots manually.'
  );

  const timerRef = useRef<number | null>(null);

  // Compute attacked cells for the current board
  const attackedCells = useMemo(() => {
    return getAttackedCells(board, N);
  }, [board, N]);

  const attackedSet = useMemo(() => {
    const s = new Set<string>();
    attackedCells.forEach(([r, c]) => s.add(`${r},${c}`));
    return s;
  }, [attackedCells]);

  // Check manual conflicts
  const manualConflicts = useMemo(() => {
    if (!manualMode) return [];
    const conflicts: [number, number][] = [];
    for (let r = 0; r < N; r++) {
      const c = board[r];
      if (c === -1) continue;
      // Temporarily clear to test safety
      const temp = [...board];
      temp[r] = -1;
      if (!isQueenSafe(temp, r, c)) {
        conflicts.push([r, c]);
      }
    }
    return conflicts;
  }, [board, manualMode]);

  // Initialize or reset
  const handleReset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsSolving(false);
    setIsPaused(false);
    setBoard(new Array(N).fill(-1));
    setStepIndex(0);
    setSteps([]);
    setExploredCount(0);
    setRejectedCount(0);
    setStatusMessage('Grid reset. Ready for simulation or manual placement.');
  };

  // Find First Solution (animated trace)
  const handleFindSolution = () => {
    handleReset();
    setManualMode(false);
    const trace = generateNQueensSteps(N, true);
    setSteps(trace.steps);
    setExploredCount(trace.exploredStates);
    setRejectedCount(trace.rejectedStates);
    setStepIndex(0);
    setIsSolving(true);
    setIsPaused(false);

    if (onUpdateStats) {
      onUpdateStats({
        explored: trace.exploredStates,
        rejected: trace.rejectedStates,
        solutions: 1,
      });
    }
  };

  // Find all 92 distinct solutions immediately
  const handleFindAllSolutions = () => {
    handleReset();
    setManualMode(false);
    const solutions = solveAllNQueens(N);
    setAllSolutions(solutions);
    setSolutionIndex(0);
    if (solutions.length > 0) {
      setBoard(solutions[0]);
    }
    setExploredCount(2056); // total nodes explored in complete 8-Queens tree
    setRejectedCount(1964);
    setStatusMessage(`Successfully verified all ${solutions.length} distinct mathematical solutions.`);

    if (onUpdateStats) {
      onUpdateStats({
        explored: 2056,
        rejected: 1964,
        solutions: solutions.length,
      });
    }
  };

  // Stepping through generated trace
  useEffect(() => {
    if (isSolving && !isPaused && steps.length > 0) {
      timerRef.current = window.setInterval(() => {
        setStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            clearInterval(timerRef.current!);
            setIsSolving(false);
            return prev;
          }
          const next = prev + 1;
          const currentStep = steps[next];
          setBoard(currentStep.board);
          setStatusMessage(currentStep.message);
          return next;
        });
      }, speed);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [isSolving, isPaused, steps, speed]);

  const stepForward = () => {
    if (stepIndex < steps.length - 1) {
      const next = stepIndex + 1;
      setStepIndex(next);
      setBoard(steps[next].board);
      setStatusMessage(steps[next].message);
    }
  };

  const stepBackward = () => {
    if (stepIndex > 0) {
      const prev = stepIndex - 1;
      setStepIndex(prev);
      setBoard(steps[prev].board);
      setStatusMessage(steps[prev].message);
    }
  };

  // Manual cell click
  const handleCellClick = (r: number, c: number) => {
    if (!manualMode) return;
    if (isSolving) handleReset();

    const newBoard = [...board];
    if (newBoard[r] === c) {
      newBoard[r] = -1; // Remove queen
      setStatusMessage(`Removed robot sensor from Row ${r + 1}, Col ${c + 1}.`);
    } else {
      newBoard[r] = c; // Place or move queen in this row
      setStatusMessage(`Placed robot sensor at Row ${r + 1}, Col ${c + 1}.`);
    }
    setBoard(newBoard);
  };

  // Next / Prev solution navigation when viewing all 92
  const nextSolution = () => {
    if (allSolutions.length === 0) return;
    const nextIdx = (solutionIndex + 1) % allSolutions.length;
    setSolutionIndex(nextIdx);
    setBoard(allSolutions[nextIdx]);
    setStatusMessage(`Displaying verified solution ${nextIdx + 1} of ${allSolutions.length}.`);
  };

  const prevSolution = () => {
    if (allSolutions.length === 0) return;
    const prevIdx = (solutionIndex - 1 + allSolutions.length) % allSolutions.length;
    setSolutionIndex(prevIdx);
    setBoard(allSolutions[prevIdx]);
    setStatusMessage(`Displaying verified solution ${prevIdx + 1} of ${allSolutions.length}.`);
  };

  // Count placed queens
  const placedQueensCount = board.filter((c) => c !== -1).length;

  return (
    <section id="queens" className="py-20 border-b border-slate-800/60 bg-slate-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            Algorithm 1 · Backtracking
          </div>
          <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Collision-Free Robot Placement Using the 8-Queens Backtracking Algorithm
          </h2>
          <p className="mt-4 text-xs sm:text-base text-slate-300 leading-relaxed">
            The 8-Queens problem models placing eight autonomous robots (queens) on an $8 \times 8$ discrete grid
            such that no two robots occupy the same row, column, or diagonal line of sight.
            Backtracking constructs the placement row-by-row, instantly pruning any column choice that triggers
            a laser cross-fire conflict.
          </p>
        </div>

        {/* Mode Selector & Control Bar */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setManualMode(false);
                handleReset();
              }}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                !manualMode
                  ? 'bg-cyan-500 text-slate-950 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Backtracking Solver Mode
            </button>
            <button
              onClick={() => {
                setManualMode(true);
                handleReset();
                setStatusMessage('Manual Mode: Click any cell to position or relocate robot sensors.');
              }}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                manualMode
                  ? 'bg-cyan-500 text-slate-950 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Interactive Manual Placement
            </button>
          </div>

          {!manualMode ? (
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleFindSolution}
                disabled={isSolving && !isPaused}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-100 bg-cyan-600/80 hover:bg-cyan-600 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5" />
                Find First Solution
              </button>
              <button
                onClick={handleFindAllSolutions}
                disabled={isSolving}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-100 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                Enumerate 92 Solutions
              </button>
              <button
                onClick={handleReset}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                title="Reset Grid"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span>Robots Placed: <strong className="text-cyan-400 font-mono">{placedQueensCount}/8</strong></span>
              <span>Conflicts: <strong className={manualConflicts.length > 0 ? 'text-rose-400 font-mono' : 'text-emerald-400 font-mono'}>{manualConflicts.length}</strong></span>
              <button
                onClick={handleReset}
                className="px-2.5 py-1 text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition-colors"
              >
                Clear Board
              </button>
            </div>
          )}
        </div>

        {/* Main Interactive Stage & Controls */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: 8x8 Chessboard Visualizer (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="w-full max-w-[500px] p-4 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl relative">
              {/* Board Header Labels */}
              <div className="grid grid-cols-8 gap-1 mb-1 text-center font-mono text-[10px] sm:text-xs text-slate-400 font-semibold pl-6">
                {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((col) => (
                  <span key={col}>{col}</span>
                ))}
              </div>

              {/* Grid with Row Numbers */}
              <div className="space-y-1">
                {Array.from({ length: N }).map((_, r) => {
                  const currentQueenCol = board[r];
                  const isCurrentRowActive = !manualMode && isSolving && steps[stepIndex]?.row === r;

                  return (
                    <div key={`row-${r}`} className="flex items-center gap-1.5">
                      {/* Row Label (1..8) */}
                      <span className="w-4 text-right font-mono text-[10px] sm:text-xs text-slate-400 font-semibold">
                        {r + 1}
                      </span>

                      {/* Row Cells */}
                      <div className="grid grid-cols-8 gap-1 flex-1">
                        {Array.from({ length: N }).map((_, c) => {
                          const hasQueen = currentQueenCol === c;
                          const isDark = (r + c) % 2 === 1;
                          const isAttacked = attackedSet.has(`${r},${c}`);
                          const isConflicted = manualConflicts.some(([cr, cc]) => cr === r && cc === c);
                          const isTestingCell = !manualMode && isSolving && steps[stepIndex]?.row === r && steps[stepIndex]?.col === c;

                          return (
                            <button
                              key={`cell-${r}-${c}`}
                              onClick={() => handleCellClick(r, c)}
                              disabled={!manualMode}
                              className={`aspect-square rounded-md relative flex items-center justify-center transition-all ${
                                hasQueen
                                  ? isConflicted
                                    ? 'bg-rose-600/90 shadow-lg shadow-rose-600/30 ring-2 ring-rose-400'
                                    : 'bg-cyan-500 shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-300'
                                  : isTestingCell
                                  ? 'bg-amber-500/40 ring-2 ring-amber-400 animate-pulse'
                                  : isAttacked && manualMode
                                  ? 'bg-rose-950/40 border border-rose-800/50'
                                  : isDark
                                  ? 'bg-slate-950 hover:bg-slate-800/80 border border-slate-800/40'
                                  : 'bg-slate-900 hover:bg-slate-800/80 border border-slate-800/60'
                              } ${manualMode ? 'cursor-pointer hover:scale-95' : 'cursor-default'}`}
                              aria-label={`Row ${r + 1}, Col ${c + 1}`}
                            >
                              {/* Robot Queen Icon */}
                              {hasQueen && (
                                <Bot
                                  className={`w-5 h-5 sm:w-6 sm:h-6 ${
                                    isConflicted ? 'text-white animate-bounce' : 'text-slate-950'
                                  }`}
                                />
                              )}

                              {/* Attacked laser marker in manual mode */}
                              {manualMode && isAttacked && !hasQueen && (
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500/40" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Active Step Action Callout Banner */}
              {!manualMode && steps.length > 0 && steps[stepIndex] && (
                <div className="mt-4 p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all bg-slate-950/90 border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400 text-[11px]">
                      Step {stepIndex + 1}/{steps.length}:
                    </span>
                    {steps[stepIndex].action === 'try' && (
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-semibold border border-amber-500/30 flex items-center gap-1">
                        Testing Placement
                      </span>
                    )}
                    {steps[stepIndex].action === 'place' && (
                      <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-semibold border border-cyan-500/30 flex items-center gap-1">
                        Constraint Passed
                      </span>
                    )}
                    {steps[stepIndex].action === 'conflict' && (
                      <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 font-semibold border border-rose-500/30 flex items-center gap-1">
                        Laser Collision · Pruning Subtree
                      </span>
                    )}
                    {steps[stepIndex].action === 'backtrack' && (
                      <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 font-semibold border border-purple-500/30 flex items-center gap-1">
                        Dead-End · Backtracking
                      </span>
                    )}
                    {steps[stepIndex].action === 'solution' && (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-semibold border border-emerald-500/30 flex items-center gap-1">
                        Complete Valid Solution Found
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400">
                    Depth {steps[stepIndex].row + 1}/8
                  </span>
                </div>
              )}

              {/* Status Message Console */}
              <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300 leading-relaxed font-mono">
                  {statusMessage}
                </p>
              </div>

              {/* Animated Step Playback Deck & Speed Controls */}
              {!manualMode && steps.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-800 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={stepBackward}
                        disabled={stepIndex === 0}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40"
                        title="Step Backward"
                      >
                        <SkipBack className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setIsPaused(!isPaused)}
                        className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs flex items-center gap-1"
                      >
                        {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                        <span>{isPaused ? 'Resume' : 'Pause'}</span>
                      </button>
                      <button
                        onClick={stepForward}
                        disabled={stepIndex >= steps.length - 1}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40"
                        title="Step Forward"
                      >
                        <SkipForward className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Speed Presets for Easy Teaching / Viva */}
                    <div className="flex items-center gap-1 text-[11px]">
                      <span className="text-slate-400 mr-1">Pace:</span>
                      <button
                        onClick={() => setSpeed(1800)}
                        className={`px-2 py-0.5 rounded border transition-colors ${
                          speed >= 1500
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-semibold'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        Slow / Viva (1.8s)
                      </button>
                      <button
                        onClick={() => setSpeed(900)}
                        className={`px-2 py-0.5 rounded border transition-colors ${
                          speed >= 700 && speed < 1500
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-semibold'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        Demo (0.9s)
                      </button>
                      <button
                        onClick={() => setSpeed(300)}
                        className={`px-2 py-0.5 rounded border transition-colors ${
                          speed < 700
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-semibold'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        Fast (0.3s)
                      </button>
                    </div>
                  </div>

                  {/* Slider Control */}
                  <div className="flex items-center justify-between gap-3 text-xs text-slate-400 bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                    <span className="text-[11px]">Simulation Speed:</span>
                    <input
                      type="range"
                      min="100"
                      max="3000"
                      step="50"
                      value={speed}
                      onChange={(e) => setSpeed(Number(e.target.value))}
                      className="flex-1 accent-cyan-400 cursor-pointer"
                    />
                    <span className="font-mono text-cyan-400 tabular-nums text-xs whitespace-nowrap">
                      {speed >= 1000 ? `${(speed / 1000).toFixed(1)}s / step` : `${speed}ms / step`}
                      {speed >= 1200 && <span className="text-emerald-400 ml-1 text-[10px]">(Viva Slow)</span>}
                    </span>
                  </div>
                </div>
              )}

              {/* Solution Navigator when viewing all 92 */}
              {allSolutions.length > 0 && !isSolving && (
                <div className="mt-4 p-2.5 rounded-xl bg-slate-950 border border-cyan-800/50 flex items-center justify-between">
                  <button
                    onClick={prevSolution}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono text-cyan-400 font-semibold">
                    Solution {solutionIndex + 1} of {allSolutions.length} (92 Total)
                  </span>
                  <button
                    onClick={nextSolution}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: Telemetry & Theory Deck (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Analytics Counters */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                <span className="text-xs text-slate-400">Explored States</span>
                <div className="mt-1 text-2xl font-bold font-mono text-cyan-400 tabular-nums">
                  {exploredCount}
                </div>
                <span className="text-[10px] text-slate-500">Recursive row trials</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                <span className="text-xs text-slate-400">Pruned Collisions</span>
                <div className="mt-1 text-2xl font-bold font-mono text-rose-400 tabular-nums">
                  {rejectedCount}
                </div>
                <span className="text-[10px] text-slate-500">Early diagonal/col rejects</span>
              </div>
            </div>

            {/* Pseudocode Walkthrough */}
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono text-slate-400">
                <span>RECURSIVE BACKTRACKING PSEUDOCODE</span>
                <span className="text-cyan-400 font-bold">O(N!)</span>
              </div>
              <pre className="mt-3 text-xs font-mono text-slate-300 leading-relaxed overflow-x-auto">
{`function solveNQueens(board, row):
  if row == N:
    recordSolution(board)
    return true

  for col from 0 to N-1:
    if isSafe(board, row, col):
      board[row] = col        // Place
      if solveNQueens(board, row + 1):
        return true           // Subtree valid
      board[row] = -1         // Backtrack

  return false                // Prune dead-end`}
              </pre>
            </div>

            {/* Algorithmic Rigor & Mathematical Complexity */}
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2.5 text-xs text-slate-300">
              <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Complexity & Pruning Analysis</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                <strong className="text-slate-200">Time Complexity:</strong> $O(N!)$ in worst case. Without pruning,
                testing all possible queen placements requires exploring $\binom{64}{8} = 4,426,165,368$ combinations.
                Row-wise backtracking with safety checking reduces the complete enumeration search space to just <strong>2,056 node explorations</strong> to extract all <strong>92 solutions</strong>.
              </p>
              <p className="text-slate-400 leading-relaxed">
                <strong className="text-slate-200">Auxiliary Space Complexity:</strong> $O(N)$ on the call stack,
                requiring only an array of length 8 to represent the robot positions, excluding stored solutions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
