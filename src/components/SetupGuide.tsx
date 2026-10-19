import React, { useState } from 'react';
import { X, Download, Terminal, FolderOpen, Play, CheckCircle2, Copy, Check } from 'lucide-react';

interface SetupGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SetupGuide({ isOpen, onClose }: SetupGuideProps) {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const steps = [
    {
      icon: <Download size={20} />,
      title: '1. Установите Node.js',
      description: 'Скачайте и установите Node.js (версия 18 или выше) с официального сайта.',
      link: 'https://nodejs.org/',
      linkText: 'nodejs.org → скачать LTS',
    },
    {
      icon: <Terminal size={20} />,
      title: '2. Откройте терминал в папке проекта',
      description: 'Откройте папку со скачанным проектом. Нажмите правой кнопкой мыши по папке → "Открыть в Терминале" или используйте PowerShell/CMD.',
      command: 'cd C:\\Users\\ВашеИмя\\Downloads\\workspace',
      cmdId: 'cd',
    },
    {
      icon: <FolderOpen size={20} />,
      title: '3. Установите зависимости',
      description: 'Эта команда установит все необходимые библиотеки из package.json.',
      command: 'npm install',
      cmdId: 'install',
    },
    {
      icon: <Play size={20} />,
      title: '4. Запустите проект',
      description: 'Запустите dev-сервер. Проект откроется в браузере автоматически.',
      command: 'npm run dev',
      cmdId: 'dev',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-100">🚀 Как запустить проект на Windows</h2>
            <p className="text-xs text-gray-500 mt-0.5">Пошаговая инструкция для локального запуска</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-gray-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Quick summary */}
          <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/20 rounded-xl p-4">
            <p className="text-sm text-gray-300 leading-relaxed">
              <span className="text-purple-400 font-semibold">💡 Быстрый старт:</span> если Node.js уже установлен,
              просто откройте терминал в папке проекта и выполните:
            </p>
            <div className="mt-3 bg-black/40 rounded-lg p-3 font-mono text-xs flex items-center justify-between">
              <code className="text-emerald-400">npm install && npm run dev</code>
              <button
                onClick={() => copyToClipboard('npm install && npm run dev', 'quick')}
                className="text-gray-500 hover:text-gray-300 ml-2"
              >
                {copiedCmd === 'quick' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          {/* Steps */}
          {steps.map((step, idx) => (
            <div key={idx} className="bg-gray-800/30 border border-gray-800 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 flex-shrink-0">
                  {step.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-200">{step.title}</h3>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">{step.description}</p>

                  {step.link && (
                    <a
                      href={step.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-xs text-blue-400 hover:text-blue-300"
                    >
                      {step.linkText}
                    </a>
                  )}

                  {step.command && (
                    <div className="mt-3 bg-black/40 rounded-lg p-2.5 font-mono text-xs flex items-center justify-between">
                      <code className="text-emerald-400">$ {step.command}</code>
                      <button
                        onClick={() => copyToClipboard(step.command!, step.cmdId)}
                        className="text-gray-500 hover:text-gray-300 ml-2"
                      >
                        {copiedCmd === step.cmdId ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* After launch */}
          <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <h3 className="text-sm font-semibold text-emerald-300">После запуска</h3>
            </div>
            <ul className="text-xs text-gray-400 space-y-1.5 list-disc list-inside">
              <li>Откройте браузер и перейдите по адресу: <code className="text-emerald-400 bg-black/30 px-1.5 py-0.5 rounded">http://localhost:5173</code></li>
              <li>Нажмите <span className="text-purple-300">"Загрузить демо-проект"</span> чтобы увидеть работу агента</li>
              <li>Или перетащите свою папку с проектом в окно загрузки</li>
              <li>Опишите задачу в чате — агент выполнит её автономно</li>
            </ul>
          </div>

          {/* Troubleshooting */}
          <details className="bg-gray-800/30 border border-gray-800 rounded-xl overflow-hidden">
            <summary className="px-4 py-3 text-sm font-medium text-gray-300 cursor-pointer hover:bg-gray-800/50">
              ⚠️ Если что-то не работает
            </summary>
            <div className="px-4 pb-4 text-xs text-gray-400 space-y-2">
              <p><span className="text-yellow-400">Ошибка "npm не является командой":</span> Node.js не установлен или не добавлен в PATH. Переустановите Node.js.</p>
              <p><span className="text-yellow-400">Ошибка при npm install:</span> удалите папку <code className="bg-black/30 px-1 rounded">node_modules</code> и файл <code className="bg-black/30 px-1 rounded">package-lock.json</code>, затем снова выполните <code className="bg-black/30 px-1 rounded">npm install</code>.</p>
              <p><span className="text-yellow-400">Порт 5173 занят:</span> закройте другие приложения или запустите <code className="bg-black/30 px-1 rounded">npm run dev -- --port 3000</code>.</p>
              <p><span className="text-yellow-400">Белый экран:</span> откройте DevTools (F12) и посмотрите вкладку Console на наличие ошибок.</p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
