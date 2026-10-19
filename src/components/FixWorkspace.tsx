import React, { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { X, Download, AlertTriangle, CheckCircle2, Copy, Check, FileArchive, FolderOpen, Terminal } from 'lucide-react';

interface FixWorkspaceProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FixWorkspace({ isOpen, onClose }: FixWorkspaceProps) {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleDownloadZip = async () => {
    setIsDownloading(true);
    try {
      // Создаём минимальный проект
      const zip = new JSZip();
      
      // package.json
      zip.file('package.json', JSON.stringify({
        name: "ai-dev-agent",
        private: true,
        version: "1.0.0",
        type: "module",
        scripts: {
          dev: "vite",
          build: "vite build",
          preview: "vite preview"
        },
        dependencies: {
          "lucide-react": "^0.263.1",
          "react": "^18.2.0",
          "react-dom": "^18.2.0",
          "react-dropzone": "^14.2.3"
        },
        devDependencies: {
          "@types/react": "^18.2.15",
          "@types/react-dom": "^18.2.7",
          "@vitejs/plugin-react": "^4.0.3",
          "autoprefixer": "^10.4.14",
          "postcss": "^8.4.27",
          "tailwindcss": "^3.3.3",
          "typescript": "^5.0.2",
          "vite": "^4.4.5"
        }
      }, null, 2));

      // index.html
      zip.file('index.html', `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AI Dev Agent</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`);

      // vite.config.js
      zip.file('vite.config.js', `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`);

      // README с инструкцией
      zip.file('README.md', `# AI Dev Agent

## Как запустить

1. Установите Node.js с https://nodejs.org (версия 18+)
2. Откройте терминал в этой папке
3. Выполните:
   \`\`\`
   npm install
   npm run dev
   \`\`\`
4. Откройте http://localhost:5173 в браузере

## Что это?

AI Dev Agent — автономный AI-помощник для разработки.
Загрузите проект и опишите задачу — агент проанализирует код,
создаст тесты, исправит ошибки и запустит проект.
`);

      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, 'ai-dev-agent.zip');
    } catch (error) {
      console.error('Ошибка при создании архива:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center">
              <AlertTriangle size={20} className="text-yellow-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-100">Проблема с файлом workspace</h2>
              <p className="text-xs text-gray-500 mt-0.5">Решение за 30 секунд</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-gray-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Объяснение проблемы */}
          <div className="bg-yellow-900/10 border border-yellow-500/20 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-yellow-300 mb-2">🤔 Что произошло?</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Файл <code className="bg-black/40 px-2 py-0.5 rounded text-yellow-400">workspace</code> без расширения — это 
              <span className="text-emerald-400 font-semibold"> ZIP-архив</span>, который браузер скачал без расширения. 
              Это обычная ситуация, и её легко исправить!
            </p>
          </div>

          {/* Решение 1: Быстрое */}
          <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 size={18} className="text-emerald-400" />
              <h3 className="text-sm font-semibold text-emerald-300">✅ Решение 1: Переименовать файл (быстро)</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center flex-shrink-0">1</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-300">Найдите файл <code className="bg-black/40 px-2 py-0.5 rounded text-yellow-400">workspace</code> в папке Загрузки</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center flex-shrink-0">2</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-300">Нажмите правой кнопкой мыши → <span className="text-blue-400">"Переименовать"</span></p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center flex-shrink-0">3</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-300 mb-2">Добавьте расширение <code className="bg-black/40 px-2 py-0.5 rounded text-emerald-400">.zip</code> в конце:</p>
                  <div className="bg-black/40 rounded-lg p-3 font-mono text-xs flex items-center justify-between">
                    <div>
                      <span className="text-red-400 line-through">workspace</span>
                      <span className="text-gray-500 mx-2">→</span>
                      <span className="text-emerald-400">workspace.zip</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard('workspace.zip', 'rename')}
                      className="text-gray-500 hover:text-gray-300 ml-2"
                    >
                      {copiedCmd === 'rename' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center flex-shrink-0">4</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-300">Дважды кликните по файлу <code className="bg-black/40 px-2 py-0.5 rounded text-emerald-400">workspace.zip</code> и распакуйте его</p>
                </div>
              </div>
            </div>
          </div>

          {/* Решение 2: Скачать заново */}
          <div className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Download size={18} className="text-blue-400" />
              <h3 className="text-sm font-semibold text-blue-300">📦 Решение 2: Скачать проект заново (правильно)</h3>
            </div>
            
            <p className="text-sm text-gray-300 mb-3">
              Нажмите кнопку ниже, чтобы скачать проект в формате ZIP с правильным расширением:
            </p>

            <button
              onClick={handleDownloadZip}
              disabled={isDownloading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isDownloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Создаём архив...
                </>
              ) : (
                <>
                  <FileArchive size={18} />
                  Скачать ai-dev-agent.zip
                </>
              )}
            </button>
          </div>

          {/* После распаковки */}
          <div className="bg-gray-800/30 border border-gray-800 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
              <FolderOpen size={16} className="text-purple-400" />
              После распаковки архива
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold flex items-center justify-center flex-shrink-0">1</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-300">Откройте папку с распакованным проектом</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold flex items-center justify-center flex-shrink-0">2</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-300 mb-2">Откройте терминал в этой папке (правый клик → "Открыть в Терминале")</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold flex items-center justify-center flex-shrink-0">3</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-300 mb-2">Установите зависимости:</p>
                  <div className="bg-black/40 rounded-lg p-2.5 font-mono text-xs flex items-center justify-between">
                    <code className="text-emerald-400">$ npm install</code>
                    <button
                      onClick={() => copyToClipboard('npm install', 'install')}
                      className="text-gray-500 hover:text-gray-300 ml-2"
                    >
                      {copiedCmd === 'install' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold flex items-center justify-center flex-shrink-0">4</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-300 mb-2">Запустите проект:</p>
                  <div className="bg-black/40 rounded-lg p-2.5 font-mono text-xs flex items-center justify-between">
                    <code className="text-emerald-400">$ npm run dev</code>
                    <button
                      onClick={() => copyToClipboard('npm run dev', 'dev')}
                      className="text-gray-500 hover:text-gray-300 ml-2"
                    >
                      {copiedCmd === 'dev' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold flex items-center justify-center flex-shrink-0">5</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-300">
                    Откройте браузер: <code className="bg-black/40 px-2 py-0.5 rounded text-blue-400">http://localhost:5173</code>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Важное примечание */}
          <div className="bg-red-900/10 border border-red-500/20 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-red-300 mb-2 flex items-center gap-2">
              <Terminal size={16} />
              Важно: Установите Node.js
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Для запуска проекта нужен <span className="text-emerald-400 font-semibold">Node.js</span> (версия 18 или выше). 
              Если он не установлен, скачайте с{' '}
              <a 
                href="https://nodejs.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                nodejs.org
              </a>
              {' '}и установите.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
