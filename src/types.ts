export interface FileNode {
  name: string;
  type: 'file' | 'directory';
  children?: FileNode[];
  content?: string;
  path: string;
  language?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  actions?: AgentAction[];
}

export interface AgentAction {
  id: string;
  type: 'read_file' | 'write_file' | 'run_command' | 'run_test' | 'analyze' | 'fix_bug' | 'create_test';
  description: string;
  status: 'pending' | 'running' | 'success' | 'error';
  details?: string;
  timestamp: Date;
}

export interface TestResult {
  id: string;
  name: string;
  file: string;
  status: 'pass' | 'fail' | 'pending' | 'running';
  duration?: number;
  error?: string;
  output?: string;
}

export interface TerminalLine {
  id: string;
  type: 'command' | 'output' | 'error' | 'success' | 'info';
  content: string;
  timestamp: Date;
}

export interface ProjectState {
  files: FileNode[];
  isLoaded: boolean;
  projectName: string;
}

export type AgentPhase = 'idle' | 'analyzing' | 'planning' | 'coding' | 'testing' | 'fixing' | 'complete';
