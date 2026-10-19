import React from 'react';
import { AgentAction } from '../types';
import {
  FileSearch, FileEdit, TerminalSquare, TestTube,
  Bug, FilePlus, CheckCircle, XCircle, Loader, Clock
} from 'lucide-react';

interface ActionLogProps {
  actions: AgentAction[];
}

export default function ActionLog({ actions }: ActionLogProps) {
  const getActionIcon = (type: AgentAction['type']) => {
    switch (type) {
      case 'read_file': return <FileSearch size={12} className="text-blue-400" />;
      case 'write_file': return <FileEdit size={12} className="text-green-400" />;
      case 'run_command': return <TerminalSquare size={12} className="text-yellow-400" />;
      case 'run_test': return <TestTube size={12} className="text-purple-400" />;
      case 'analyze': return <FileSearch size={12} className="text-cyan-400" />;
      case 'fix_bug': return <Bug size={12} className="text-red-400" />;
      case 'create_test': return <FilePlus size={12} className="text-emerald-400" />;
    }
  };

  const getStatusIcon = (status: AgentAction['status']) => {
    switch (status) {
      case 'pending': return <Clock size={12} className="text-gray-500" />;
      case 'running': return <Loader size={12} className="text-blue-400 animate-spin" />;
      case 'success': return <CheckCircle size={12} className="text-emerald-400" />;
      case 'error': return <XCircle size={12} className="text-red-400" />;
    }
  };

  const getStatusColor = (status: AgentAction['status']) => {
    switch (status) {
      case 'pending': return 'border-gray-800/50 bg-gray-900/20';
      case 'running': return 'border-blue-800/50 bg-blue-900/10';
      case 'success': return 'border-emerald-800/30 bg-emerald-900/5';
      case 'error': return 'border-red-800/50 bg-red-900/10';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-2 border-b border-gray-800 bg-gray-900/50">
        <span className="text-xs font-medium text-gray-400">
          Лог действий агента ({actions.length})
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {actions.length === 0 ? (
          <div className="text-gray-600 text-xs italic p-2">
            Действия агента будут отображаться здесь...
          </div>
        ) : (
          actions.map((action, index) => (
            <div
              key={action.id}
              className={`rounded-lg border px-3 py-2 transition-all ${getStatusColor(action.status)}`}
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-600 font-mono w-4">{index + 1}</span>
                {getActionIcon(action.type)}
                <span className="text-xs text-gray-300 flex-1">{action.description}</span>
                {getStatusIcon(action.status)}
              </div>
              {action.details && action.status !== 'running' && (
                <div className="mt-1.5 pl-6 text-[11px] text-gray-500 leading-relaxed">
                  {action.details}
                </div>
              )}
              {action.status === 'running' && (
                <div className="mt-1.5 pl-6">
                  <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full animate-pulse w-2/3" />
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
