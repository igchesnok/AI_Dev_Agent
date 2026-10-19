import { FileNode, AgentAction, TestResult, TerminalLine, ChatMessage } from '../types';

const generateId = () => Math.random().toString(36).substr(2, 9);

export function createSampleProject(): FileNode[] {
  return [
    {
      name: 'src',
      type: 'directory',
      path: '/src',
      children: [
        {
          name: 'index.ts',
          type: 'file',
          path: '/src/index.ts',
          language: 'typescript',
          content: `import { App } from './app';
import { Database } from './database';

const db = new Database('localhost', 5432);
const app = new App(db);

app.start(3000);
console.log('Server started on port 3000');`
        },
        {
          name: 'app.ts',
          type: 'file',
          path: '/src/app.ts',
          language: 'typescript',
          content: `import { Database } from './database';
import { Router } from './router';

export class App {
  private db: Database;
  private router: Router;

  constructor(db: Database) {
    this.db = db;
    this.router = new Router();
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.get('/users', async () => {
      return await this.db.query('SELECT * FROM users');
    });

    this.router.post('/users', async (body: any) => {
      return await this.db.insert('users', body);
    });

    this.router.get('/users/:id', async (params: any) => {
      return await this.db.query('SELECT * FROM users WHERE id = ?', [params.id]);
    });
  }

  async start(port: number) {
    await this.db.connect();
    this.router.listen(port);
  }
}`
        },
        {
          name: 'database.ts',
          type: 'file',
          path: '/src/database.ts',
          language: 'typescript',
          content: `export class Database {
  private host: string;
  private port: number;
  private connected: boolean = false;

  constructor(host: string, port: number) {
    this.host = host;
    this.port = port;
  }

  async connect() {
    // Connect to database
    this.connected = true;
    console.log(\`Connected to \${this.host}:\${this.port}\`);
  }

  async query(sql: string, params?: any[]) {
    if (!this.connected) throw new Error('Not connected');
    // Execute query
    return [];
  }

  async insert(table: string, data: any) {
    if (!this.connected) throw new Error('Not connected');
    // Insert data
    return { id: 1, ...data };
  }

  async disconnect() {
    this.connected = false;
  }
}`
        },
        {
          name: 'router.ts',
          type: 'file',
          path: '/src/router.ts',
          language: 'typescript',
          content: `type Handler = (params?: any) => Promise<any>;

interface Route {
  method: string;
  path: string;
  handler: Handler;
}

export class Router {
  private routes: Route[] = [];

  get(path: string, handler: Handler) {
    this.routes.push({ method: 'GET', path, handler });
  }

  post(path: string, handler: Handler) {
    this.routes.push({ method: 'POST', path, handler });
  }

  listen(port: number) {
    console.log(\`Router listening on port \${port}\`);
    console.log(\`Registered \${this.routes.length} routes\`);
  }
}`
        }
      ]
    },
    {
      name: 'package.json',
      type: 'file',
      path: '/package.json',
      language: 'json',
      content: `{
  "name": "my-api-server",
  "version": "1.0.0",
  "scripts": {
    "start": "ts-node src/index.ts",
    "test": "jest",
    "build": "tsc"
  },
  "dependencies": {
    "express": "^4.18.0"
  }
}`
    },
    {
      name: 'tsconfig.json',
      type: 'file',
      path: '/tsconfig.json',
      language: 'json',
      content: `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "outDir": "./dist"
  }
}`
    },
    {
      name: 'README.md',
      type: 'file',
      path: '/README.md',
      language: 'markdown',
      content: `# My API Server
A simple REST API server with TypeScript.`
    }
  ];
}

export async function simulateAgentAnalysis(files: FileNode[], userRequest: string): Promise<{
  actions: AgentAction[];
  tests: TestResult[];
  terminalLogs: TerminalLine[];
  response: string;
}> {
  const actions: AgentAction[] = [];
  const tests: TestResult[] = [];
  const terminalLogs: TerminalLine[] = [];

  // Phase 1: Analyze project structure
  const analyzeAction: AgentAction = {
    id: generateId(),
    type: 'analyze',
    description: 'Анализ структуры проекта и зависимостей',
    status: 'running',
    timestamp: new Date()
  };
  actions.push(analyzeAction);

  terminalLogs.push({
    id: generateId(),
    type: 'info',
    content: '🔍 Анализирую структуру проекта...',
    timestamp: new Date()
  });

  await delay(800);

  terminalLogs.push({
    id: generateId(),
    type: 'output',
    content: `Найдено файлов: ${countFiles(files)}`,
    timestamp: new Date()
  });

  analyzeAction.status = 'success';
  analyzeAction.details = `Проанализировано ${countFiles(files)} файлов, определены зависимости и архитектура`;

  // Phase 2: Read key files
  const readAction: AgentAction = {
    id: generateId(),
    type: 'read_file',
    description: 'Чтение ключевых файлов проекта',
    status: 'running',
    timestamp: new Date()
  };
  actions.push(readAction);

  terminalLogs.push({
    id: generateId(),
    type: 'command',
    content: '$ cat src/app.ts src/database.ts src/router.ts',
    timestamp: new Date()
  });

  await delay(600);

  readAction.status = 'success';
  readAction.details = 'Прочитаны основные файлы: app.ts, database.ts, router.ts, index.ts';

  // Phase 3: Analyze request and plan
  const planAction: AgentAction = {
    id: generateId(),
    type: 'analyze',
    description: `Планирование: ${userRequest}`,
    status: 'running',
    timestamp: new Date()
  };
  actions.push(planAction);

  terminalLogs.push({
    id: generateId(),
    type: 'info',
    content: '📋 Составляю план выполнения...',
    timestamp: new Date()
  });

  await delay(500);

  planAction.status = 'success';
  planAction.details = 'План: 1) Создать тесты 2) Внести изменения 3) Запустить тесты 4) Исправить ошибки';

  // Phase 4: Create tests
  const testAction: AgentAction = {
    id: generateId(),
    type: 'create_test',
    description: 'Создание тестов для проверки функциональности',
    status: 'running',
    timestamp: new Date()
  };
  actions.push(testAction);

  terminalLogs.push({
    id: generateId(),
    type: 'command',
    content: '$ npm test -- --coverage',
    timestamp: new Date()
  });

  await delay(400);

  const testNames = [
    { name: 'Database connection', file: 'database.test.ts' },
    { name: 'API routes', file: 'app.test.ts' },
    { name: 'User CRUD operations', file: 'app.test.ts' },
    { name: 'Error handling', file: 'app.test.ts' },
    { name: 'Router matching', file: 'router.test.ts' },
  ];

  for (const t of testNames) {
    const test: TestResult = {
      id: generateId(),
      name: t.name,
      file: t.file,
      status: 'running',
    };
    tests.push(test);
    await delay(300);

    // Simulate some tests failing
    if (t.name === 'Error handling' || t.name === 'User CRUD operations') {
      test.status = 'fail';
      test.error = 'AssertionError: Expected status 200 but got 500';
      test.duration = Math.floor(Math.random() * 100) + 50;
    } else {
      test.status = 'pass';
      test.duration = Math.floor(Math.random() * 50) + 10;
    }
  }

  testAction.status = 'success';
  testAction.details = `Создано ${testNames.length} тестов. Пройдено: ${tests.filter(t => t.status === 'pass').length}, Ошибок: ${tests.filter(t => t.status === 'fail').length}`;

  terminalLogs.push({
    id: generateId(),
    type: 'output',
    content: `Tests: ${tests.filter(t => t.status === 'pass').length} passed, ${tests.filter(t => t.status === 'fail').length} failed`,
    timestamp: new Date()
  });

  // Phase 5: Fix bugs
  const failingTests = tests.filter(t => t.status === 'fail');
  if (failingTests.length > 0) {
    const fixAction: AgentAction = {
      id: generateId(),
      type: 'fix_bug',
      description: `Исправление ${failingTests.length} ошибок в тестах`,
      status: 'running',
      timestamp: new Date()
    };
    actions.push(fixAction);

    terminalLogs.push({
      id: generateId(),
      type: 'error',
      content: `⚠️ Обнаружены ошибки в ${failingTests.length} тестах. Исправляю...`,
      timestamp: new Date()
    });

    await delay(1000);

    // Write fixes
    const writeAction: AgentAction = {
      id: generateId(),
      type: 'write_file',
      description: 'Внесение исправлений в код',
      status: 'running',
      timestamp: new Date()
    };
    actions.push(writeAction);

    terminalLogs.push({
      id: generateId(),
      type: 'command',
      content: '$ patch src/app.ts --fix-error-handling',
      timestamp: new Date()
    });

    await delay(600);

    writeAction.status = 'success';
    writeAction.details = 'Добавлена обработка ошибок в app.ts: try-catch блоки, валидация входных данных';

    // Re-run tests
    const retestAction: AgentAction = {
      id: generateId(),
      type: 'run_test',
      description: 'Повторный запуск тестов',
      status: 'running',
      timestamp: new Date()
    };
    actions.push(retestAction);

    terminalLogs.push({
      id: generateId(),
      type: 'command',
      content: '$ npm test',
      timestamp: new Date()
    });

    await delay(800);

    // Fix failing tests
    for (const test of failingTests) {
      test.status = 'pass';
      test.error = undefined;
      test.duration = Math.floor(Math.random() * 50) + 10;
    }

    retestAction.status = 'success';
    retestAction.details = `Все тесты пройдены! ${tests.length}/${tests.length} passed`;

    fixAction.status = 'success';
    fixAction.details = 'Все ошибки исправлены, тесты проходят';

    terminalLogs.push({
      id: generateId(),
      type: 'success',
      content: `✅ Все тесты пройдены! ${tests.length}/${tests.length} passed`,
      timestamp: new Date()
    });
  }

  // Phase 6: Run project
  const runAction: AgentAction = {
    id: generateId(),
    type: 'run_command',
    description: 'Запуск проекта',
    status: 'running',
    timestamp: new Date()
  };
  actions.push(runAction);

  terminalLogs.push({
    id: generateId(),
    type: 'command',
    content: '$ npm start',
    timestamp: new Date()
  });

  await delay(500);

  terminalLogs.push({
    id: generateId(),
    type: 'output',
    content: 'Connected to localhost:5432',
    timestamp: new Date()
  });

  terminalLogs.push({
    id: generateId(),
    type: 'output',
    content: 'Router listening on port 3000',
    timestamp: new Date()
  });

  terminalLogs.push({
    id: generateId(),
    type: 'success',
    content: 'Server started on port 3000',
    timestamp: new Date()
  });

  runAction.status = 'success';
  runAction.details = 'Проект успешно запущен на порту 3000';

  const response = generateResponse(userRequest, tests, actions);

  return { actions, tests, terminalLogs, response };
}

function generateResponse(userRequest: string, tests: TestResult[], actions: AgentAction[]): string {
  const passedTests = tests.filter(t => t.status === 'pass').length;
  const totalTests = tests.length;
  const filesModified = actions.filter(a => a.type === 'write_file').length;
  const bugsFixed = actions.filter(a => a.type === 'fix_bug').length;

  return `## Выполнено ✅

**Запрос:** "${userRequest}"

### Что было сделано:
1. 📂 Проанализирована структура проекта
2. 📝 Созданы тесты для проверки функциональности
3. 🔧 Внесены необходимые изменения в код
4. 🧪 Запущены тесты (${passedTests}/${totalTests} пройдено)
5. 🐛 Исправлены обнаруженные ошибки
6. 🚀 Проект успешно запущен

### Статистика:
- Файлов изменено: ${filesModified}
- Ошибок исправлено: ${bugsFixed}
- Тестов пройдено: ${passedTests}/${totalTests}
- Время выполнения: ~${Math.floor(Math.random() * 10) + 5}с

### Рекомендации:
- Добавить больше edge-case тестов
- Рассмотреть добавление валидации входных данных
- Настроить CI/CD для автоматического тестирования`;
}

function countFiles(nodes: FileNode[]): number {
  let count = 0;
  for (const node of nodes) {
    if (node.type === 'file') count++;
    if (node.children) count += countFiles(node.children);
  }
  return count;
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
