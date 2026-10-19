import React from 'react';
import { X, Code2, Globe, Zap, TestTube, Bug, Rocket, CheckCircle2 } from 'lucide-react';

interface AgentCapabilitiesProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AgentCapabilities({ isOpen, onClose }: AgentCapabilitiesProps) {
  if (!isOpen) return null;

  const languages = [
    {
      name: 'TypeScript / JavaScript',
      icon: '🟦',
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      frameworks: ['React', 'Next.js', 'Express', 'Node.js', 'Vue', 'Angular'],
      color: 'from-blue-500/20 to-blue-600/20',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-400'
    },
    {
      name: 'Python',
      icon: '🐍',
      extensions: ['.py'],
      frameworks: ['Django', 'Flask', 'FastAPI', 'PyTorch', 'TensorFlow'],
      color: 'from-yellow-500/20 to-green-500/20',
      borderColor: 'border-yellow-500/30',
      textColor: 'text-yellow-400'
    },
    {
      name: 'Go',
      icon: '🐹',
      extensions: ['.go'],
      frameworks: ['Gin', 'Echo', 'Fiber'],
      color: 'from-cyan-500/20 to-blue-500/20',
      borderColor: 'border-cyan-500/30',
      textColor: 'text-cyan-400'
    },
    {
      name: 'Rust',
      icon: '🦀',
      extensions: ['.rs'],
      frameworks: ['Actix', 'Rocket', 'Axum'],
      color: 'from-orange-500/20 to-red-500/20',
      borderColor: 'border-orange-500/30',
      textColor: 'text-orange-400'
    },
    {
      name: 'Java / Kotlin',
      icon: '☕',
      extensions: ['.java', '.kt'],
      frameworks: ['Spring Boot', 'Ktor', 'Android'],
      color: 'from-red-500/20 to-orange-500/20',
      borderColor: 'border-red-500/30',
      textColor: 'text-red-400'
    },
    {
      name: 'C / C++',
      icon: '⚙️',
      extensions: ['.c', '.cpp', '.h', '.hpp'],
      frameworks: ['Qt', 'Unreal Engine'],
      color: 'from-purple-500/20 to-blue-500/20',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-400'
    },
    {
      name: 'Ruby',
      icon: '💎',
      extensions: ['.rb'],
      frameworks: ['Rails', 'Sinatra'],
      color: 'from-red-500/20 to-pink-500/20',
      borderColor: 'border-red-500/30',
      textColor: 'text-red-400'
    },
    {
      name: 'PHP',
      icon: '🐘',
      extensions: ['.php'],
      frameworks: ['Laravel', 'Symfony'],
      color: 'from-indigo-500/20 to-purple-500/20',
      borderColor: 'border-indigo-500/30',
      textColor: 'text-indigo-400'
    },
    {
      name: 'Swift',
      icon: '🍎',
      extensions: ['.swift'],
      frameworks: ['iOS', 'macOS', 'Vapor'],
      color: 'from-orange-500/20 to-red-500/20',
      borderColor: 'border-orange-500/30',
      textColor: 'text-orange-400'
    },
    {
      name: 'HTML / CSS',
      icon: '🎨',
      extensions: ['.html', '.css', '.scss'],
      frameworks: ['Tailwind', 'Bootstrap', 'Sass'],
      color: 'from-pink-500/20 to-purple-500/20',
      borderColor: 'border-pink-500/30',
      textColor: 'text-pink-400'
    }
  ];

  const capabilities = [
    {
      icon: <Code2 size={20} />,
      title: 'Анализ кода',
      description: 'Агент читает и понимает структуру проекта, находит зависимости, архитектуру и паттерны',
      color: 'text-blue-400'
    },
    {
      icon: <TestTube size={20} />,
      title: 'Создание тестов',
      description: 'Автоматически генерирует unit-тесты, интеграционные тесты и тесты покрытия',
      color: 'text-purple-400'
    },
    {
      icon: <Bug size={20} />,
      title: 'Поиск и исправление багов',
      description: 'Находит ошибки в коде, анализирует stack trace и предлагает исправления',
      color: 'text-red-400'
    },
    {
      icon: <Zap size={20} />,
      title: 'Оптимизация',
      description: 'Предлагает улучшения производительности, рефакторинг и best practices',
      color: 'text-yellow-400'
    },
    {
      icon: <Rocket size={20} />,
      title: 'Запуск проекта',
      description: 'Устанавливает зависимости, настраивает окружение и запускает приложение',
      color: 'text-emerald-400'
    },
    {
      icon: <Globe size={20} />,
      title: 'Мультиязычность',
      description: 'Поддерживает более 10 языков программирования и десятки фреймворков',
      color: 'text-cyan-400'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center">
              <Zap size={20} className="text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-100">Возможности AI Dev Agent</h2>
              <p className="text-xs text-gray-500 mt-0.5">Какие языки и технологии понимает агент</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-gray-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Capabilities */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              Что умеет агент
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {capabilities.map((cap, idx) => (
                <div key={idx} className="bg-gray-800/30 border border-gray-800 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className={`${cap.color} flex-shrink-0`}>
                      {cap.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-200">{cap.title}</h4>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">{cap.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <Code2 size={16} className="text-blue-400" />
              Поддерживаемые языки программирования
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {languages.map((lang, idx) => (
                <div key={idx} className={`bg-gradient-to-br ${lang.color} border ${lang.borderColor} rounded-xl p-4`}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{lang.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-semibold ${lang.textColor}`}>{lang.name}</h4>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {lang.extensions.map((ext) => (
                          <span key={ext} className="text-[10px] px-2 py-0.5 bg-black/30 rounded text-gray-300">
                            {ext}
                          </span>
                        ))}
                      </div>
                      <div className="mt-2">
                        <p className="text-[10px] text-gray-500 mb-1">Фреймворки:</p>
                        <div className="flex flex-wrap gap-1">
                          {lang.frameworks.slice(0, 4).map((fw) => (
                            <span key={fw} className="text-[10px] px-2 py-0.5 bg-white/5 rounded text-gray-400">
                              {fw}
                            </span>
                          ))}
                          {lang.frameworks.length > 4 && (
                            <span className="text-[10px] px-2 py-0.5 text-gray-500">
                              +{lang.frameworks.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Note about AI integration */}
          <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/20 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-purple-300 mb-2 flex items-center gap-2">
              <Zap size={16} />
              Важно: Подключение реального AI
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Текущая версия — это <span className="text-yellow-400">демо-симуляция</span>, показывающая как работает агент. 
              Для полноценной работы с реальными проектами нужно подключить AI API:
            </p>
            <ul className="text-xs text-gray-400 mt-2 space-y-1 list-disc list-inside">
              <li><span className="text-blue-400">OpenAI GPT-4</span> — для генерации кода и анализа</li>
              <li><span className="text-purple-400">Anthropic Claude</span> — для глубокого понимания кода</li>
              <li><span className="text-emerald-400">CodeLlama</span> — специализированная модель для кода</li>
            </ul>
            <p className="text-xs text-gray-500 mt-2">
              После подключения AI агент сможет реально анализировать ваш код, создавать тесты и исправлять ошибки.
            </p>
          </div>

          {/* Example tasks */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3">💡 Примеры задач для агента</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                'Добавь аутентификацию JWT',
                'Оптимизируй запросы к базе данных',
                'Создай тесты для всех API эндпоинтов',
                'Рефакторинг кода по принципам SOLID',
                'Добавь обработку ошибок и логирование',
                'Настрой Docker для деплоя',
                'Мигрируй с JavaScript на TypeScript',
                'Добавь rate limiting для API'
              ].map((task, idx) => (
                <div key={idx} className="bg-gray-800/30 border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-400">
                  {task}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
