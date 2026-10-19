import React from 'react';
import { TestResult } from '../types';
import { CheckCircle, XCircle, Clock, Loader } from 'lucide-react';

interface TestPanelProps {
  tests: TestResult[];
}

export default function TestPanel({ tests }: TestPanelProps) {
  const passed = tests.filter(t => t.status === 'pass').length;
  const failed = tests.filter(t => t.status === 'fail').length;
  const pending = tests.filter(t => t.status === 'pending' || t.status === 'running').length;

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pass': return <CheckCircle size={14} className="text-emerald-400" />;
      case 'fail': return <XCircle size={14} className="text-red-400" />;
      case 'pending': return <Clock size={14} className="text-gray-500" />;
      case 'running': return <Loader size={14} className="text-blue-400 animate-spin" />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-2 border-b border-gray-800 bg-gray-900/50">
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1">
            <CheckCircle size={12} className="text-emerald-400" />
            <span className="text-emerald-400">{passed} пройдено</span>
          </span>
          <span className="flex items-center gap-1">
            <XCircle size={12} className="text-red-400" />
            <span className="text-red-400">{failed} ошибок</span>
          </span>
          {pending > 0 && (
            <span className="flex items-center gap-1">
              <Loader size={12} className="text-blue-400 animate-spin" />
              <span className="text-blue-400">{pending} в процессе</span>
            </span>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {tests.length === 0 ? (
          <div className="text-gray-600 text-xs italic p-2">Тесты будут созданы агентом...</div>
        ) : (
          tests.map((test) => (
            <div
              key={test.id}
              className={`flex items-center gap-2 px-3 py-2 rounded text-xs ${
                test.status === 'fail' ? 'bg-red-900/20 border border-red-900/30' :
                test.status === 'pass' ? 'bg-emerald-900/10 border border-emerald-900/20' :
                'bg-gray-800/30 border border-gray-800/50'
              }`}
            >
              {getStatusIcon(test.status)}
              <span className="flex-1 text-gray-300">{test.name}</span>
              <span className="text-gray-500 text-[10px]">{test.file}</span>
              {test.duration && (
                <span className="text-gray-500 text-[10px]">{test.duration}ms</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
