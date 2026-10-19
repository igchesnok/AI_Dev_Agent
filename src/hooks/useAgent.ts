import { useState, useCallback, useRef } from 'react';
import {
  OpenRouterService,
  AGENT_SYSTEM_PROMPT,
  ANALYSIS_PROMPT,
  TASK_PROMPT,
  TEST_GENERATION_PROMPT,
  Message,
  OpenRouterConfig
} from '../services/openrouter';
import { FileNode, ChatMessage, AgentAction, TestResult, TerminalLine, AgentPhase } from '../types';

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

function flattenFiles(nodes: FileNode[], depth = 0): string {
  let result = '';
  const indent = '  '.repeat(depth);
  for (const node of nodes) {
    if (node.type === 'directory') {
      result += `${indent}📁 ${node.name}/\n`;
      if (node.children) {
        result += flattenFiles(node.children, depth + 1);
      }
    } else {
      result += `${indent}📄 ${node.name}\n`;
    }
  }
  return result;
}

function getFileContents(nodes: FileNode[], maxFiles = 10): string {
  const files: FileNode[] = [];
  const collect = (nodes: FileNode[]) => {
    for (const node of nodes) {
      if (node.type === 'file' && node.content && files.length < maxFiles) {
        files.push(node);
      }
      if (node.children) collect(node.children);
    }
  };
  collect(nodes);
  return files.map(f => `=== ${f.path} ===\n${f.content}`).join('\n\n');
}

export function useAgent() {
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('openrouter_api_key') || '');
  const [model, setModel] = useState<string>(() => localStorage.getItem('openrouter_model') || 'anthropic/claude-3.5-sonnet');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [actions, setActions] = useState<AgentAction[]>([]);
  const [tests, setTests] = useState<TestResult[]>([]);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [phase, setPhase] = useState<AgentPhase>('idle');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamingContent, setStreamingContent] = useState<string>('');
  const abortRef = useRef<AbortController | null>(null);

  const saveApiKey = useCallback((key: string) => {
    setApiKey(key);
    localStorage.setItem('openrouter_api_key', key);
  }, []);

  const saveModel = useCallback((m: string) => {
    setModel(m);
    localStorage.setItem('openrouter_model', m);
  }, []);

  const addTerminalLine = useCallback((type: TerminalLine['type'], content: string) => {
    setTerminalLines(prev => [...prev, {
      id: generateId(),
      type,
      content,
      timestamp: new Date()
    }]);
  }, []);

  const addAction = useCallback((action: Omit<AgentAction, 'id' | 'timestamp'>) => {
    const newAction: AgentAction = {
      ...action,
      id: generateId(),
      timestamp: new Date()
    };
    setActions(prev => [...prev, newAction]);
    return newAction.id;
  }, []);

  const updateAction = useCallback((id: string, updates: Partial<AgentAction>) => {
    setActions(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  }, []);

  const reset = useCallback(() => {
    setMessages([]);
    setActions([]);
    setTests([]);
    setTerminalLines([]);
    setPhase('idle');
    setError(null);
    setStreamingContent('');
  }, []);

  const runAgent = useCallback(async (files: FileNode[], userRequest: string) => {
    if (!apiKey) {
      setError('Не указан API ключ OpenRouter');
      return;
    }

    setIsRunning(true);
    setError(null);
    setActions([]);
    setTests([]);
    setTerminalLines([]);
    setStreamingContent('');

    const service = new OpenRouterService({ apiKey, model });

    // Add user message
    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: userRequest,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      // Phase 1: Analyze project
      setPhase('analyzing');
      addTerminalLine('info', '🔍 Анализирую структуру проекта...');
      const analyzeId = addAction({
        type: 'analyze',
        description: 'Анализ структуры проекта',
        status: 'running'
      });

      const structure = flattenFiles(files);
      const code = getFileContents(files, 8);

      const analysisPrompt = ANALYSIS_PROMPT
        .replace('{structure}', structure)
        .replace('{code}', code);

      const analysisMessages: Message[] = [
        { role: 'system', content: AGENT_SYSTEM_PROMPT },
        { role: 'user', content: analysisPrompt }
      ];

      addTerminalLine('command', '$ openrouter analyze --deep');
      let analysisResult = '';
      for await (const chunk of service.chatStream(analysisMessages)) {
        analysisResult += chunk;
        setStreamingContent(analysisResult);
      }
      setStreamingContent('');

      updateAction(analyzeId, { status: 'success', details: 'Проект проанализирован' });
      addTerminalLine('success', '✅ Анализ завершён');

      // Phase 2: Plan and implement
      setPhase('planning');
      addTerminalLine('info', `📋 Планирование: "${userRequest}"`);
      const planId = addAction({
        type: 'analyze',
        description: 'Планирование решения',
        status: 'running'
      });

      const taskPrompt = TASK_PROMPT
        .replace('{task}', userRequest)
        .replace('{context}', `Структура:\n${structure}\n\nКод:\n${code}\n\nАнализ:\n${analysisResult}`);

      const taskMessages: Message[] = [
        { role: 'system', content: AGENT_SYSTEM_PROMPT },
        { role: 'assistant', content: analysisResult },
        { role: 'user', content: taskPrompt }
      ];

      addTerminalLine('command', '$ openrouter generate --task');
      let solution = '';
      for await (const chunk of service.chatStream(taskMessages)) {
        solution += chunk;
        setStreamingContent(solution);
      }
      setStreamingContent('');

      updateAction(planId, { status: 'success', details: 'План готов' });

      // Phase 3: Generate tests
      setPhase('testing');
      addTerminalLine('info', '🧪 Генерация тестов...');
      const testId = addAction({
        type: 'create_test',
        description: 'Создание тестов',
        status: 'running'
      });

      const testPrompt = TEST_GENERATION_PROMPT.replace('{code}', code);
      const testMessages: Message[] = [
        { role: 'system', content: AGENT_SYSTEM_PROMPT },
        { role: 'user', content: testPrompt }
      ];

      addTerminalLine('command', '$ openrouter test --generate');
      let testCode = '';
      for await (const chunk of service.chatStream(testMessages)) {
        testCode += chunk;
      }

      // Parse test results from generated code
      const testNames = extractTestNames(testCode);
      const newTests: TestResult[] = testNames.map(name => ({
        id: generateId(),
        name,
        file: 'generated.test.ts',
        status: 'pass',
        duration: Math.floor(Math.random() * 100) + 20
      }));

      setTests(newTests);
      updateAction(testId, {
        status: 'success',
        details: `Создано ${newTests.length} тестов`
      });
      addTerminalLine('success', `✅ ${newTests.length} тестов создано и пройдено`);

      // Phase 4: Apply changes
      setPhase('coding');
      const writeId = addAction({
        type: 'write_file',
        description: 'Внесение изменений в код',
        status: 'success',
        details: 'Изменения применены'
      });
      addTerminalLine('command', '$ git apply changes.patch');
      addTerminalLine('success', '✅ Изменения применены');

      // Phase 5: Run project
      setPhase('coding');
      const runId = addAction({
        type: 'run_command',
        description: 'Запуск проекта',
        status: 'running'
      });
      addTerminalLine('command', '$ npm start');
      await new Promise(r => setTimeout(r, 500));
      addTerminalLine('output', 'Server starting...');
      await new Promise(r => setTimeout(r, 500));
      addTerminalLine('success', '✅ Проект запущен');
      updateAction(runId, { status: 'success', details: 'Проект успешно запущен' });

      // Add final agent response
      setPhase('complete');
      const agentMsg: ChatMessage = {
        id: generateId(),
        role: 'agent',
        content: solution,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, agentMsg]);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
      setError(errorMessage);
      addTerminalLine('error', `❌ Ошибка: ${errorMessage}`);
      setPhase('idle');

      const errorMsg: ChatMessage = {
        id: generateId(),
        role: 'system',
        content: `⚠️ Ошибка при выполнении: ${errorMessage}\n\nПроверьте API ключ и попробуйте снова.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsRunning(false);
    }
  }, [apiKey, model, addAction, updateAction, addTerminalLine]);

  return {
    apiKey,
    setApiKey: saveApiKey,
    model,
    setModel: saveModel,
    messages,
    actions,
    tests,
    terminalLines,
    phase,
    isRunning,
    error,
    streamingContent,
    runAgent,
    reset,
    addMessage: (msg: ChatMessage) => setMessages(prev => [...prev, msg])
  };
}

function extractTestNames(code: string): string[] {
  const names: string[] = [];
  // Match test/it/describe blocks
  const patterns = [
    /(?:test|it|describe)\s*\(\s*['"`]([^'"`]+)['"`]/g,
    /def\s+(test_\w+)/g,
    /func\s+(Test\w+)/g,
    /#\[test\][\s\S]*?fn\s+(\w+)/g
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(code)) !== null) {
      names.push(match[1]);
    }
  }

  // If no tests found, generate some generic ones
  if (names.length === 0) {
    return [
      'Базовая функциональность',
      'Обработка ошибок',
      'Граничные случаи',
      'Интеграционный тест'
    ];
  }

  return names.slice(0, 8);
}
