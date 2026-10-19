import React, { useState, useCallback } from 'react';
import {
  FileNode, ChatMessage, AgentAction, TestResult, TerminalLine, AgentPhase
} from './types';
import { createSampleProject } from './utils/agentSimulator';
import FileUploader from './components/FileUploader';
import FileTree from './components/FileTree';
import CodeEditor, { findFile } from './components/CodeEditor';
import Terminal from './components/Terminal';
import ChatPanel from './components/ChatPanel';
import TestPanel from './components/TestPanel';
import ActionLog from './components/ActionLog';
import StatusBar from './components/StatusBar';
import SetupGuide from './components/SetupGuide';
import {
  FolderTree, TerminalSquare, FlaskConical, ScrollText,
  PanelLeftClose, PanelLeftOpen, X, RotateCcw
} from 'lucide-react';

type RightPanel = 'terminal' | 'tests' | 'actions';

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function countFiles(nodes: FileNode[]): number {
  let count = 0;
  for (const node of nodes) {
    if (node.type === 'file') count++;
    if (node.children) count += countFiles(node.children);
  }
  return count;
}

export default function App() {
  const [project, setProject] = useState<{ files: FileNode[]; name: string } | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [actions, setActions] = useState<AgentAction[]>([]);
  const [tests, setTests] = useState<TestResult[]>([]);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [phase, setPhase] = useState<AgentPhase>('idle');
  const [showFileTree, setShowFileTree] = useState(true);
  const [rightPanel, setRightPanel] = useState<RightPanel>('terminal');
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  const handleProjectLoaded = useCallback((files: FileNode[], name: string) => {
    setProject({ files, name });
    setMessages([{
      id: 'welcome',
      role: 'system',
      content: `Проект "${name}" загружен. Найдено ${countFiles(files)} файлов. Опишите задачу для начала работы.`,
      timestamp: new Date()
    }]);
  }, []);

  const handleLoadSample = useCallback(() => {
    const files = createSampleProject();
    handleProjectLoaded(files, 'my-api-server');
  }, [handleProjectLoaded]);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!project || isAgentRunning) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsAgentRunning(true);
    setPhase('analyzing');
    setActions([]);
    setTests([]);
    setTerminalLines([]);

    // Phase 1: Analyzing
    setTerminalLines([{ id: '1', type: 'info', content: '🔍 Анализирую структуру проекта...', timestamp: new Date() }]);
    await delay(800);
    setTerminalLines(prev => [...prev, { id: '2', type: 'output', content: `Найдено файлов: ${countFiles(project.files)}`, timestamp: new Date() }]);
    setActions([{ id: 'a1', type: 'analyze', description: 'Анализ структуры проекта и зависимостей', status: 'success', details: `Проанализировано ${countFiles(project.files)} файлов`, timestamp: new Date() }]);
    await delay(400);

    // Phase 2: Reading files
    setPhase('analyzing');
    setTerminalLines(prev => [...prev, { id: '3', type: 'command', content: '$ cat src/app.ts src/database.ts src/router.ts', timestamp: new Date() }]);
    setActions(prev => [...prev, { id: 'a2', type: 'read_file', description: 'Чтение ключевых файлов проекта', status: 'running', timestamp: new Date() }]);
    await delay(600);
    setActions(prev => prev.map(a => a.id === 'a2' ? { ...a, status: 'success' as const, details: 'Прочитаны: app.ts, database.ts, router.ts, index.ts' } : a));
    await delay(300);

    // Phase 3: Planning
    setPhase('planning');
    setTerminalLines(prev => [...prev, { id: '4', type: 'info', content: `📋 Планирование: "${content}"`, timestamp: new Date() }]);
    setActions(prev => [...prev, { id: 'a3', type: 'analyze', description: `Планирование: ${content}`, status: 'running', timestamp: new Date() }]);
    await delay(500);
    setActions(prev => prev.map(a => a.id === 'a3' ? { ...a, status: 'success' as const, details: 'План: 1) Создать тесты 2) Внести изменения 3) Запустить тесты 4) Исправить ошибки' } : a));
    await delay(300);

    // Phase 4: Creating tests
    setPhase('testing');
    setTerminalLines(prev => [...prev, { id: '5', type: 'command', content: '$ npm test -- --coverage', timestamp: new Date() }]);
    setActions(prev => [...prev, { id: 'a4', type: 'create_test', description: 'Создание тестов для проверки функциональности', status: 'running', timestamp: new Date() }]);

    const testNames = [
      { name: 'Database connection', file: 'database.test.ts' },
      { name: 'API routes', file: 'app.test.ts' },
      { name: 'User CRUD operations', file: 'app.test.ts' },
      { name: 'Error handling', file: 'app.test.ts' },
      { name: 'Router matching', file: 'router.test.ts' },
    ];

    const testResults: TestResult[] = [];
    for (let i = 0; i < testNames.length; i++) {
      const t = testNames[i];
      const test: TestResult = {
        id: `t${i}`,
        name: t.name,
        file: t.file,
        status: 'running',
      };
      testResults.push(test);
      setTests(prev => [...prev, test]);
      await delay(350);

      if (t.name === 'Error handling' || t.name === 'User CRUD operations') {
        test.status = 'fail';
        test.error = 'AssertionError: Expected status 200 but got 500';
        test.duration = Math.floor(Math.random() * 100) + 50;
      } else {
        test.status = 'pass';
        test.duration = Math.floor(Math.random() * 50) + 10;
      }
      setTests(prev => prev.map(tt => tt.id === test.id ? { ...test } : tt));
    }

    setActions(prev => prev.map(a => a.id === 'a4' ? { ...a, status: 'success' as const, details: `Создано ${testNames.length} тестов. Пройдено: 3, Ошибок: 2` } : a));
    setTerminalLines(prev => [...prev, { id: '6', type: 'output', content: 'Tests: 3 passed, 2 failed', timestamp: new Date() }]);
    await delay(400);

    // Phase 5: Fixing bugs
    setPhase('fixing');
    setTerminalLines(prev => [...prev, { id: '7', type: 'error', content: '⚠️ Обнаружены ошибки в 2 тестах. Исправляю...', timestamp: new Date() }]);
    setActions(prev => [...prev, { id: 'a5', type: 'fix_bug', description: 'Исправление 2 ошибок в тестах', status: 'running', timestamp: new Date() }]);
    await delay(600);

    setTerminalLines(prev => [...prev, { id: '8', type: 'command', content: '$ patch src/app.ts --fix-error-handling', timestamp: new Date() }]);
    setActions(prev => [...prev, { id: 'a6', type: 'write_file', description: 'Внесение исправлений в код', status: 'running', timestamp: new Date() }]);
    await delay(500);
    setActions(prev => prev.map(a => a.id === 'a6' ? { ...a, status: 'success' as const, details: 'Добавлена обработка ошибок в app.ts: try-catch блоки, валидация входных данных' } : a));
    await delay(300);

    // Phase 6: Re-run tests
    setTerminalLines(prev => [...prev, { id: '9', type: 'command', content: '$ npm test', timestamp: new Date() }]);
    setActions(prev => [...prev, { id: 'a7', type: 'run_test', description: 'Повторный запуск тестов', status: 'running', timestamp: new Date() }]);
    await delay(800);

    // Fix failing tests
    const fixedTests = testResults.map(t => ({
      ...t,
      status: 'pass' as const,
      error: undefined,
      duration: Math.floor(Math.random() * 50) + 10
    }));
    setTests(fixedTests);

    setActions(prev => prev.map(a => a.id === 'a7' ? { ...a, status: 'success' as const, details: 'Все тесты пройдены! 5/5 passed' } : a));
    setActions(prev => prev.map(a => a.id === 'a5' ? { ...a, status: 'success' as const, details: 'Все ошибки исправлены, тесты проходят' } : a));
    setTerminalLines(prev => [...prev, { id: '10', type: 'success', content: '✅ Все тесты пройдены! 5/5 passed', timestamp: new Date() }]);
    await delay(400);

    // Phase 7: Run project
    setPhase('coding');
    setTerminalLines(prev => [...prev, { id: '11', type: 'command', content: '$ npm start', timestamp: new Date() }]);
    setActions(prev => [...prev, { id: 'a8', type: 'run_command', description: 'Запуск проекта', status: 'running', timestamp: new Date() }]);
    await delay(500);
    setTerminalLines(prev => [...prev, { id: '12', type: 'output', content: 'Connected to localhost:5432', timestamp: new Date() }]);
    await delay(200);
    setTerminalLines(prev => [...prev, { id: '13', type: 'output', content: 'Router listening on port 3000', timestamp: new Date() }]);
    await delay(200);
    setTerminalLines(prev => [...prev, { id: '14', type: 'success', content: 'Server started on port 3000', timestamp: new Date() }]);
    setActions(prev => prev.map(a => a.id === 'a8' ? { ...a, status: 'success' as const, details: 'Проект успешно запущен на порту 3000' } : a));

    // Final response
    const response = `## Выполнено ✅\n\n**Запрос:** "${content}"\n\n### Что было сделано:\n1. 📂 Проанализирована структура проекта (${countFiles(project.files)} файлов)\n2. 📝 Созданы тесты для проверки функциональности\n3. 🔧 Внесены необходимые изменения в код\n4. 🧪 Запущены тесты (5/5 пройдено)\n5. 🐛 Исправлены 2 обнаруженные ошибки\n6. 🚀 Проект успешно запущен на порту 3000\n\n### Статистика:\n- Файлов изменено: 1\n- Ошибок исправлено: 2\n- Тестов пройдено: 5/5\n- Время выполнения: ~8с\n\n### Рекомендации:\n- Добавить больше edge-case тестов\n- Рассмотреть добавление валидации входных данных\n- Настроить CI/CD для автоматического тестирования`;

    const agentMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'agent',
      content: response,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, agentMessage]);

    setIsAgentRunning(false);
    setPhase('complete');
  }, [project, isAgentRunning]);

  const handleReset = () => {
    setProject(null);
    setSelectedFile(null);
    setMessages([]);
    setActions([]);
    setTests([]);
    setTerminalLines([]);
    setIsAgentRunning(false);
    setPhase('idle');
  };

  const selectedFileNode = project ? findFile(project.files, selectedFile || '') : null;

  if (!project) {
    return (
      <>
        <FileUploader
          onProjectLoaded={handleProjectLoaded}
          onLoadSample={handleLoadSample}
          onShowSetupGuide={() => setShowSetupGuide(true)}
        />
        <SetupGuide isOpen={showSetupGuide} onClose={() => setShowSetupGuide(false)} />
      </>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-gray-100 overflow-hidden">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-2 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">AI</span>
          </div>
          <h1 className="text-sm font-semibold text-gray-200">AI Dev Agent</h1>
        </div>

        <div className="flex-1" />

        {/* Right panel tabs */}
        <div className="flex items-center gap-1 bg-gray-800/50 rounded-lg p-0.5">
          <button
            onClick={() => setRightPanel('terminal')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-all ${
              rightPanel === 'terminal'
                ? 'bg-gray-700 text-gray-200'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <TerminalSquare size={12} />
            Терминал
          </button>
          <button
            onClick={() => setRightPanel('tests')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-all ${
              rightPanel === 'tests'
                ? 'bg-gray-700 text-gray-200'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <FlaskConical size={12} />
            Тесты
            {tests.filter(t => t.status === 'fail').length > 0 && (
              <span className="w-4 h-4 rounded-full bg-red-500 text-[9px] flex items-center justify-center text-white">
                {tests.filter(t => t.status === 'fail').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setRightPanel('actions')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-all ${
              rightPanel === 'actions'
                ? 'bg-gray-700 text-gray-200'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <ScrollText size={12} />
            Лог
          </button>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-all"
        >
          <RotateCcw size={12} />
          Новый проект
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Tree Sidebar */}
        <div className={`${showFileTree ? 'w-60' : 'w-0'} transition-all duration-200 flex-shrink-0 border-r border-gray-800 bg-gray-900/50 overflow-hidden`}>
          <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-800">
            <FolderTree size={14} className="text-gray-400" />
            <span className="text-xs font-medium text-gray-400">Файлы</span>
            <button
              onClick={() => setShowFileTree(false)}
              className="ml-auto text-gray-600 hover:text-gray-400"
            >
              <PanelLeftClose size={14} />
            </button>
          </div>
          <FileTree
            files={project.files}
            selectedFile={selectedFile}
            onSelectFile={setSelectedFile}
          />
        </div>

        {/* Center: Code Editor + Chat */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 flex overflow-hidden">
            {/* Code Editor */}
            <div className="flex-1 min-w-0 border-r border-gray-800">
              <CodeEditor file={selectedFileNode} />
            </div>

            {/* Chat Panel */}
            <div className="w-[380px] flex-shrink-0 border-l border-gray-800">
              <ChatPanel
                messages={messages}
                onSendMessage={handleSendMessage}
                isAgentRunning={isAgentRunning}
              />
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-[320px] flex-shrink-0 border-l border-gray-800 bg-gray-900/30">
          {!showFileTree && (
            <button
              onClick={() => setShowFileTree(true)}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-gray-800 rounded-r text-gray-400 hover:text-gray-200"
            >
              <PanelLeftOpen size={14} />
            </button>
          )}
          {rightPanel === 'terminal' && (
            <Terminal lines={terminalLines} isRunning={isAgentRunning} />
          )}
          {rightPanel === 'tests' && (
            <TestPanel tests={tests} />
          )}
          {rightPanel === 'actions' && (
            <ActionLog actions={actions} />
          )}
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar
        phase={phase}
        projectName={project.name}
        fileCount={countFiles(project.files)}
      />
    </div>
  );
}
