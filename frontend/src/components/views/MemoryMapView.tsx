import React, { useState } from 'react';
import { 
  Network, Search, Filter, ZoomIn, ZoomOut, RotateCcw, 
  FileCode, Layers, ArrowRight, ShieldAlert 
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';
import { ArchitectureNode } from '../../types';

export const MemoryMapView: React.FC = () => {
  const { currentInvestigation, openFileViewer } = useInvestigation();
  const [selectedNode, setSelectedNode] = useState<ArchitectureNode | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [filterGhostOnly, setFilterGhostOnly] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');

  if (!currentInvestigation) {
    return <div className="p-8 text-center text-slate-400 font-mono">No active investigation loaded.</div>;
  }

  const { nodes, edges } = currentInvestigation.architecture;

  const displayNodes = nodes.filter((n) => {
    const matchesSearch = n.label.toLowerCase().includes(search.toLowerCase()) || 
                          (n.file_path && n.file_path.toLowerCase().includes(search.toLowerCase()));
    const matchesGhost = !filterGhostOnly || n.ghost_status;
    return matchesSearch && matchesGhost;
  });

  // Calculate layout coordinates for SVG visualization in circular or grouped layout
  const width = 800;
  const height = 550;
  const centerX = width / 2;
  const centerY = height / 2;

  // Group by module vs functions
  const moduleNodes = displayNodes.filter((n) => n.type === 'module');
  const functionNodes = displayNodes.filter((n) => n.type === 'function');

  const nodePositions: Record<string, { x: number; y: number }> = {};

  // Position modules in an outer circle
  moduleNodes.forEach((node, i) => {
    const angle = (i / Math.max(1, moduleNodes.length)) * 2 * Math.PI;
    const radius = 220;
    nodePositions[node.id] = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });

  // Position functions in an inner cluster
  functionNodes.forEach((node, i) => {
    const angle = (i / Math.max(1, functionNodes.length)) * 2 * Math.PI;
    const radius = 110;
    nodePositions[node.id] = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });

  return (
    <div className="p-6 sm:p-10 space-y-6 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-relic-border pb-6">
        <div>
          <div className="flex items-center space-x-2 text-relic-cyan mb-1">
            <Network className="w-5 h-5" />
            <span className="font-mono text-xs uppercase tracking-widest">
              DEPENDENCY & AST RECONSTRUCTION GRAPH
            </span>
          </div>
          <h1 className="text-3xl font-bold font-mono text-slate-100">
            Architecture Memory Map
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Visual topology of modules, functions, import dependencies, and entry routes.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.15, 2.0))}
            className="p-2 rounded-xl bg-relic-card border border-relic-border hover:border-slate-500 text-slate-300 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.15, 0.6))}
            className="p-2 rounded-xl bg-relic-card border border-relic-border hover:border-slate-500 text-slate-300 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="p-2 rounded-xl bg-relic-card border border-relic-border hover:border-slate-500 text-slate-300 transition-colors"
            title="Reset Zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Canvas Area & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* SVG Graph Canvas */}
        <div className="lg:col-span-3 rounded-2xl bg-[#090b11] border border-relic-border relative overflow-hidden min-h-[550px] flex items-center justify-center">
          {/* Faint circuit background grid */}
          <div className="absolute inset-0 circuit-pattern opacity-40 pointer-events-none" />

          <svg
            className="w-full h-full cursor-grab active:cursor-grabbing transition-transform duration-200"
            viewBox={`0 0 ${width} ${height}`}
            style={{ transform: `scale(${zoom})` }}
          >
            {/* Draw Edges */}
            {edges.map((e, idx) => {
              const p1 = nodePositions[e.source];
              const p2 = nodePositions[e.target];
              if (!p1 || !p2) return null;
              return (
                <line
                  key={idx}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={e.relationship === 'defines' ? '#334155' : '#06b6d4'}
                  strokeWidth={e.relationship === 'defines' ? 1.5 : 1}
                  strokeDasharray={e.relationship === 'imports' ? '4 4' : undefined}
                  opacity={0.4}
                />
              );
            })}

            {/* Draw Nodes */}
            {displayNodes.map((node) => {
              const pos = nodePositions[node.id];
              if (!pos) return null;
              const isSelected = selectedNode?.id === node.id;
              const isModule = node.type === 'module';

              return (
                <g
                  key={node.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  onClick={() => setSelectedNode(node)}
                  className="cursor-pointer group"
                >
                  <circle
                    r={isModule ? 24 : 16}
                    fill={isModule ? '#131722' : '#1a1f2e'}
                    stroke={
                      isSelected
                        ? '#22d3ee'
                        : isModule
                        ? '#8b5cf6'
                        : '#06b6d4'
                    }
                    strokeWidth={isSelected ? 3 : 1.5}
                    className="transition-all group-hover:scale-110"
                  />
                  <text
                    textAnchor="middle"
                    dy={isModule ? 38 : 28}
                    className="text-[10px] font-mono fill-slate-300 select-none pointer-events-none group-hover:fill-relic-cyan"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Node Count Overlay */}
          <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg bg-relic-panel/80 border border-relic-border text-xs font-mono text-slate-400 backdrop-blur-sm">
            <span>{nodes.length} Nodes</span> • <span>{edges.length} Edges</span>
          </div>
        </div>

        {/* Node Inspector Sidebar */}
        <div className="rounded-2xl bg-relic-card border border-relic-border p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-mono text-xs uppercase tracking-wider text-slate-400 mb-4 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-relic-cyan" />
              <span>NODE INSPECTOR</span>
            </h3>

            {selectedNode ? (
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Selected Symbol</span>
                  <h4 className="text-lg font-bold font-mono text-slate-100">{selectedNode.label}</h4>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-mono bg-relic-panel border border-relic-border text-relic-purple uppercase">
                    {selectedNode.type}
                  </span>
                </div>

                {selectedNode.file_path && (
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">File Path</span>
                    <p className="text-xs font-mono text-slate-200">{selectedNode.file_path}</p>
                  </div>
                )}

                {selectedNode.loc > 0 && (
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Lines of Code</span>
                    <p className="text-xs font-mono text-slate-200">{selectedNode.loc} lines</p>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    onClick={() => {
                      if (selectedNode.file_path) {
                        openFileViewer(selectedNode.file_path);
                      }
                    }}
                    className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-relic-cyan/10 hover:bg-relic-cyan/20 border border-relic-cyan text-xs font-mono text-relic-cyan font-bold transition-colors"
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span>Open in Code Viewer</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-xs font-mono text-slate-500">
                Click any node on the canvas to inspect dependencies and source code.
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-relic-border text-[11px] font-mono text-slate-500">
            <span>Graph parsed via AST syntax extraction.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
