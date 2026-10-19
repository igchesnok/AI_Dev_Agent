import React, { useState, useCallback } from 'react';
import { FileNode, ChatMessage } from './types';
import { createSampleProject } from './utils/agentSimulator';
import { useAgent } from './hooks/useAgent';
import FileUploader from './components/FileUploader';
import FileTree from './components/FileTree';
import CodeEditor, { findFile } from './components/CodeEditor';
import Terminal from './components/Terminal';
import ChatPanel from './components/ChatPanel';
import TestPanel from './components/TestPanel';
import ActionLog from './components/ActionLog';
import StatusBar from './components/StatusBar';
import ApiKeyInput from './components/ApiKeyInput';
import {
  FolderTree, TerminalSquare, FlaskConical, ScrollText,
  RotateCcw, AlertCircle
} from 'lucide-react';

type RightPanel = 'terminal' | 'tests' | 'actions';

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
  const [showFileTree, setShowFileTree] = useState(true);
  const [rightPanel, setRightPanel] = useState<RightPanel>('terminal');

  const agent = useAgent();

  const handleProjectLoaded = useCallback((files: FileNode[], name: string) => {
    setProject({ files, name });
    const welcomeMsg: ChatMessage = {
      id: 'welcome',
      role: 'system',
      content: `Проект "${name}" загружен. Найдено ${countFiles(files)} файлов.\n\n${
        agent.apiKey
          ? '✅ AI подключен. Опишите задачу для начала работы.'
          : '⚠️ Укажите API ключ OpenRouter для работы с AI.'
      }`,
      timestamp: new Date()
    };
    agent.addMessage(welcomeMsg);
  }, [agent]);

  const handleLoadSample = useCallback(() => {
    const files = createSampleProject();
    handleProjectLoaded(files, 'my-api-server');
  }, [handleProjectLoaded]);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!project || agent.isRunning) return;
    await agent.runAgent(project.files, content);
  }, [project, agent]);

  const handleReset = () => {
    setProject(null);
    setSelectedFile(null);
    agent.reset();
  };

  const selectedFileNode = project ? findFile(project.files, selectedFile || '') : null;

  if (!project) {
    return (
      <div className="h-screen flex flex-col bg-gray-900">
        <FileUploader
          onProjectLoaded={handleProjectLoaded}
          onLoadSample={handleLoadSample}
        />
        <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto">
          <ApiKeyInput
            apiKey={agent.apiKey}
            onApiKeyChange={agent.setApiKey}
            model={agent.model}
            onModelChange={agent.setModel}
          />
        </div>
      </div>
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
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            Live
          </span>
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
            {agent.tests.filter(t => t.status === 'fail').length > 0 && (
              <span className="w-4 h-4 rounded-full bg-red-500 text-[9px] flex items-center justify-center text-white">
                {agent.tests.filter(t => t.status === 'fail').length}
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

      {/* Error banner */}
      {agent.error && (
        <div className="px-4 py-2 bg-red-900/20 border-b border-red-800/50 flex items-center gap-2">
          <AlertCircle size={14} className="text-red-400" />
          <span className="text-xs text-red-300 flex-1">{agent.error}</span>
          <button
            onClick={() => agent.reset()}
            className="text-xs text-red-400 hover:text-red-300"
          >
            Закрыть
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Tree Sidebar */}
        <div className={`${showFileTree ? 'w-60' : 'w-0'} transition-all duration-200 flex-shrink-0 border-r border-gray-800 bg-gray-900/50 overflow-hidden`}>
          <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-800">
            <FolderTree size={14} className="text-gray-400" />
            <span className="text-xs font-medium text-gray-400">Файлы</span>
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
            <div className="w-[400px] flex-shrink-0 border-l border-gray-800">
              <ChatPanel
                messages={agent.messages}
                onSendMessage={handleSendMessage}
                isAgentRunning={agent.isRunning}
                streamingContent={agent.streamingContent}
              />
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-[320px] flex-shrink-0 border-l border-gray-800 bg-gray-900/30">
          {rightPanel === 'terminal' && (
            <Terminal lines={agent.terminalLines} isRunning={agent.isRunning} />
          )}
          {rightPanel === 'tests' && (
            <TestPanel tests={agent.tests} />
          )}
          {rightPanel === 'actions' && (
            <ActionLog actions={agent.actions} />
          )}
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar
        phase={agent.phase}
        projectName={project.name}
        fileCount={countFiles(project.files)}
      />
    </div>
  );
}
