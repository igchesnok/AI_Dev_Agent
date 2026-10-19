import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { Send, Bot, User, Sparkles } from 'lucide-react';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isAgentRunning: boolean;
  streamingContent?: string;
}

export default function ChatPanel({ messages, onSendMessage, isAgentRunning, streamingContent }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isAgentRunning) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const suggestedPrompts = [
    'Добавь аутентификацию JWT',
    'Оптимизируй запросы к БД',
    'Добавь обработку ошибок',
    'Создай тесты для всех эндпоинтов',
    'Рефакторинг кода по SOLID',
    'Добавь rate limiting',
  ];

  return (
    <div className="h-full flex flex-col bg-gray-900/30">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Bot size={14} className="text-white" />
          </div>
          <div>
            <span className="text-sm font-medium text-gray-200">AI Dev Agent</span>
            <div className="flex items-center gap-1">
              {isAgentRunning ? (
                <>
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-[10px] text-green-400">работает</span>
                </>
              ) : (
                <span className="text-[10px] text-gray-500">готов к работе</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-4 border border-purple-500/20">
              <Sparkles size={28} className="text-purple-400" />
            </div>
            <h3 className="text-gray-200 font-medium mb-2">AI Dev Agent</h3>
            <p className="text-gray-500 text-sm mb-6 max-w-[280px]">
              Загрузите проект и опишите задачу. Агент проанализирует код, внесёт изменения, создаст тесты и запустит проект.
            </p>
            <div className="grid grid-cols-2 gap-2 w-full max-w-[320px]">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => !isAgentRunning && onSendMessage(prompt)}
                  disabled={isAgentRunning}
                  className="text-xs px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 text-gray-400 hover:text-gray-200 hover:border-purple-500/30 hover:bg-purple-900/10 transition-all text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role !== 'user' && (
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                <Bot size={14} className="text-white" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-blue-600/20 border border-blue-500/30 text-blue-100'
                  : msg.role === 'system'
                  ? 'bg-gray-800/50 border border-gray-700/50 text-gray-400 text-xs'
                  : 'bg-gray-800/50 border border-gray-700/50 text-gray-200'
              }`}
            >
              {msg.role === 'user' && (
                <div className="flex items-center gap-1 mb-1">
                  <User size={10} className="text-blue-400" />
                  <span className="text-[10px] text-blue-400 font-medium">Вы</span>
                </div>
              )}
              <div className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</div>
              <div className="text-[10px] text-gray-600 mt-2">
                {msg.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-blue-600/30 flex items-center justify-center flex-shrink-0">
                <User size={14} className="text-blue-300" />
              </div>
            )}
          </div>
        ))}

        {/* Streaming content */}
        {isAgentRunning && streamingContent && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
              <Bot size={14} className="text-white" />
            </div>
            <div className="max-w-[85%] rounded-xl px-4 py-3 bg-gray-800/50 border border-purple-500/30 text-gray-200">
              <div className="flex items-center gap-1 mb-1">
                <Sparkles size={10} className="text-purple-400 animate-pulse" />
                <span className="text-[10px] text-purple-400 font-medium">AI генерирует...</span>
              </div>
              <div className="text-sm whitespace-pre-wrap leading-relaxed">{streamingContent}</div>
              <div className="mt-2 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t border-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isAgentRunning ? 'Агент работает...' : 'Опишите задачу для агента...'}
            disabled={isAgentRunning}
            className="flex-1 bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 disabled:opacity-50 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isAgentRunning}
            className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            <Send size={14} />
          </button>
        </div>
      </form>
    </div>
  );
}
