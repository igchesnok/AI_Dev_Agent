import React, { useState } from 'react';
import { Key, Eye, EyeOff, Check, X, Sparkles } from 'lucide-react';

interface ApiKeyInputProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  model: string;
  onModelChange: (model: string) => void;
}

const MODELS = [
  { value: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet', description: 'Лучший для кода' },
  { value: 'anthropic/claude-3-opus', label: 'Claude 3 Opus', description: 'Максимальное качество' },
  { value: 'openai/gpt-4-turbo', label: 'GPT-4 Turbo', description: 'Универсальный' },
  { value: 'openai/gpt-4', label: 'GPT-4', description: 'Стабильный' },
  { value: 'google/gemini-pro-1.5', label: 'Gemini Pro 1.5', description: 'Быстрый' },
  { value: 'meta-llama/llama-3.1-405b-instruct', label: 'Llama 3.1 405B', description: 'Open Source' },
  { value: 'mistralai/mixtral-8x22b-instruct', label: 'Mixtral 8x22B', description: 'Экономный' },
  { value: 'deepseek/deepseek-coder', label: 'DeepSeek Coder', description: 'Специализация на коде' }
];

export default function ApiKeyInput({ apiKey, onApiKeyChange, model, onModelChange }: ApiKeyInputProps) {
  const [showKey, setShowKey] = useState(false);
  const [isExpanded, setIsExpanded] = useState(!apiKey);

  const isValid = apiKey.length > 20;

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isValid ? 'bg-emerald-500/20' : 'bg-yellow-500/20'
          }`}>
            <Key size={16} className={isValid ? 'text-emerald-400' : 'text-yellow-400'} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-200">OpenRouter API</h3>
            <p className="text-[10px] text-gray-500">
              {isValid ? '✅ Подключено' : 'Требуется API ключ'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-gray-500 hover:text-gray-300"
        >
          {isExpanded ? 'Свернуть' : 'Настроить'}
        </button>
      </div>

      {isExpanded && (
        <>
          <div className="space-y-2">
            <label className="text-xs text-gray-400">API ключ OpenRouter</label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => onApiKeyChange(e.target.value)}
                placeholder="sk-or-v1-..."
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 pr-10 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500/50"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-[10px] text-gray-600">
              Получите ключ на{' '}
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 underline"
              >
                openrouter.ai/keys
              </a>
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-gray-400 flex items-center gap-1">
              <Sparkles size={12} />
              Модель AI
            </label>
            <select
              value={model}
              onChange={(e) => onModelChange(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-purple-500/50"
            >
              {MODELS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label} — {m.description}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
    </div>
  );
}
