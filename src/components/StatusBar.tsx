import React from 'react';
import { AgentPhase } from '../types';
import { Cpu, Activity, FolderOpen, Zap } from 'lucide-react';

interface StatusBarProps {
  phase: AgentPhase;
  projectName: string;
  fileCount: number;
}

export default function StatusBar({ phase, projectName, fileCount }: StatusBarProps) {
  const getPhaseInfo = () => {
    switch (phase) {
      case 'idle': return { label: 'Ожидание', color: 'text-gray-400', dot: 'bg-gray-500' };
      case 'analyzing': return { label: 'Анализ', color: 'text-cyan-400', dot: 'bg-cyan-400' };
      case 'planning': return { label: 'Планирование', color: 'text-blue-400', dot: 'bg-blue-400' };
      case 'coding': return { label: 'Кодирование', color: 'text-purple-400', dot: 'bg-purple-400' };
      case 'testing': return { label: 'Тестирование', color: 'text-yellow-400', dot: 'bg-yellow-400' };
      case 'fixing': return { label: 'Исправление', color: 'text-orange-400', dot: 'bg-orange-400' };
      case 'complete': return { label: 'Завершено', color: 'text-emerald-400', dot: 'bg-emerald-400' };
    }
  };

  const info = getPhaseInfo();

  return (
    <div className="flex items-center gap-4 px-4 py-1.5 bg-gray-900 border-t border-gray-800 text-xs">
      <div className="flex items-center gap-2">
        <FolderOpen size={12} className="text-gray-500" />
        <span className="text-gray-400">{projectName}</span>
      </div>
      <div className="flex items-center gap-2">
        <Cpu size={12} className="text-gray-500" />
        <span className="text-gray-400">{fileCount} файлов</span>
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <span className={`w-2 h-2 rounded-full ${info.dot} ${phase !== 'idle' ? 'animate-pulse' : ''}`} />
        <span className={info.color}>{info.label}</span>
      </div>
      <div className="flex items-center gap-2">
        <Zap size={12} className="text-yellow-500" />
        <span className="text-gray-500">AI Agent v1.0</span>
      </div>
    </div>
  );
}
