import React, { useEffect, useRef } from 'react';
import { TerminalLine } from '../types';
import { Terminal as TerminalIcon } from 'lucide-react';

interface TerminalProps {
  lines: TerminalLine[];
  isRunning: boolean;
}

export default function Terminal({ lines, isRunning }: TerminalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const getLineColor = (type: TerminalLine['type']) => {
    switch (type) {
      case 'command': return 'text-green-400';
      case 'output': return 'text-gray-300';
      case 'error': return 'text-red-400';
      case 'success': return 'text-emerald-400';
      case 'info': return 'text-blue-400';
      default: return 'text-gray-300';
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-950 rounded-lg border border-gray-800">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-800 bg-gray-900/50">
        <TerminalIcon size={14} className="text-gray-400" />
        <span className="text-xs font-medium text-gray-400">Терминал</span>
        {isRunning && (
          <span className="ml-auto flex items-center gap-1">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-green-400">выполняется</span>
          </span>
        )}
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 font-mono text-xs space-y-0.5">
        {lines.length === 0 ? (
          <div className="text-gray-600 italic">Ожидание команд...</div>
        ) : (
          lines.map((line) => (
            <div key={line.id} className={`${getLineColor(line.type)} leading-relaxed`}>
              {line.content}
            </div>
          ))
        )}
        {isRunning && (
          <div className="flex items-center gap-1 text-gray-500">
            <span className="animate-pulse">▊</span>
          </div>
        )}
      </div>
    </div>
  );
}
