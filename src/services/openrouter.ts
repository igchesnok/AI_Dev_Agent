export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterConfig {
  apiKey: string;
  model?: string;
  baseUrl?: string;
}

const DEFAULT_MODEL = 'anthropic/claude-3.5-sonnet';
const BASE_URL = 'https://openrouter.ai/api/v1';

export class OpenRouterService {
  private apiKey: string;
  private model: string;
  private baseUrl: string;

  constructor(config: OpenRouterConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model || DEFAULT_MODEL;
    this.baseUrl = config.baseUrl || BASE_URL;
  }

  async chat(messages: Message[], options?: {
    temperature?: number;
    maxTokens?: number;
    stream?: boolean;
  }): Promise<string> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'AI Dev Agent'
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 4000,
        stream: options?.stream ?? false
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: response.statusText } }));
      throw new Error(error.error?.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  async *chatStream(messages: Message[], options?: {
    temperature?: number;
    maxTokens?: number;
  }): AsyncGenerator<string> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'AI Dev Agent'
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 4000,
        stream: true
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: response.statusText } }));
      throw new Error(error.error?.message || `API Error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') return;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0]?.delta?.content;
            if (content) {
              yield content;
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }
  }
}

// Agent prompts
export const AGENT_SYSTEM_PROMPT = `Ты - AI Dev Agent, автономный помощник для разработки программного обеспечения.

Твои возможности:
1. Анализ кода и структуры проекта
2. Генерация кода и исправление ошибок
3. Создание тестов
4. Оптимизация и рефакторинг
5. Объяснение кода

Когда получаешь код проекта:
- Внимательно анализируй структуру
- Понимай архитектуру и зависимости
- Предлагай конкретные улучшения с примерами кода

Когда получаешь задачу:
- Разбей её на шаги
- Предоставь готовый код для каждого файла
- Объясни что и почему изменилось
- Предложи тесты для проверки

Формат ответа:
- Используй markdown для форматирования
- Оборачивай код в блоки \`\`\`язык ... \`\`\`
- Указывай путь к файлу перед блоком кода
- Будь конкретным и практичным`;

export const ANALYSIS_PROMPT = `Проанализируй следующую структуру проекта и код. Опиши:
1. Архитектуру проекта
2. Основные компоненты и их взаимодействие
3. Используемые технологии и паттерны
4. Потенциальные проблемы или улучшения

Структура проекта:
{structure}

Код основных файлов:
{code}`;

export const TASK_PROMPT = `Задача: {task}

Контекст проекта:
{context}

Предоставь решение:
1. Опиши план действий
2. Укажи какие файлы нужно создать или изменить
3. Предоставь полный код для каждого файла
4. Объясни ключевые моменты решения`;

export const TEST_GENERATION_PROMPT = `Создай тесты для следующего кода:

{code}

Требования:
1. Используй подходящий тестовый фреймворк для данного языка
2. Покрой основные сценарии использования
3. Добавь edge cases
4. Тесты должны быть читаемыми и поддерживаемыми
5. Предоставь полный код тестов`;

export const BUG_FIX_PROMPT = `Найди и исправь ошибки в следующем коде:

{code}

{errorInfo}

Предоставь:
1. Описание найденных ошибок
2. Исправленный код
3. Объяснение что было не так`;
