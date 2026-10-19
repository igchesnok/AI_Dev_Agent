import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileNode } from '../types';
import { Upload, FolderUp, FileCode, Sparkles } from 'lucide-react';

interface FileUploaderProps {
  onProjectLoaded: (files: FileNode[], name: string) => void;
  onLoadSample: () => void;
  onShowSetupGuide?: () => void;
  onShowFixWorkspace?: () => void;
}

export default function FileUploader({ onProjectLoaded, onLoadSample, onShowSetupGuide, onShowFixWorkspace }: FileUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsLoading(true);

    const fileTree: FileNode[] = [];
    const fileMap = new Map<string, FileNode>();

    for (const file of acceptedFiles) {
      const path = '/' + (file as any).webkitRelativePath || file.name;
      const parts = path.split('/').filter(Boolean);
      
      let currentLevel = fileTree;
      let currentPath = '';

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        currentPath += '/' + part;

        if (i === parts.length - 1) {
          // It's a file
          const content = await file.text();
          const ext = part.split('.').pop() || '';
          const language = getLanguage(ext);
          const fileNode: FileNode = {
            name: part,
            type: 'file',
            path: currentPath,
            content,
            language
          };
          currentLevel.push(fileNode);
        } else {
          // It's a directory
          let dir = currentLevel.find(n => n.name === part && n.type === 'directory');
          if (!dir) {
            dir = {
              name: part,
              type: 'directory',
              path: currentPath,
              children: []
            };
            currentLevel.push(dir);
          }
          currentLevel = dir.children!;
        }
      }
    }

    const projectName = acceptedFiles[0] 
      ? ((acceptedFiles[0] as any).webkitRelativePath?.split('/')[0] || 'project')
      : 'project';

    setTimeout(() => {
      onProjectLoaded(fileTree, projectName);
      setIsLoading(false);
    }, 500);
  }, [onProjectLoaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 p-8">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-purple-500/20">
            <Sparkles size={36} className="text-purple-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-100 mb-2">AI Dev Agent</h1>
          <p className="text-gray-400 text-sm">
            Автономный AI-помощник для разработки. Загрузите проект и опишите задачу — агент всё сделает сам.
          </p>
        </div>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-purple-500 bg-purple-500/10'
              : 'border-gray-700 hover:border-purple-500/50 hover:bg-gray-800/30'
          }`}
        >
          <input {...getInputProps()} {...{ webkitdirectory: '', directory: '' } as any} />
          <Upload size={32} className="mx-auto mb-4 text-gray-500" />
          {isLoading ? (
            <div className="text-gray-400">
              <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-2" />
              Загрузка проекта...
            </div>
          ) : isDragActive ? (
            <p className="text-purple-400">Отпустите файлы здесь...</p>
          ) : (
            <div>
              <p className="text-gray-300 font-medium mb-1">Перетащите папку проекта сюда</p>
              <p className="text-gray-500 text-sm">или нажмите для выбора</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-800" />
          <span className="text-gray-600 text-xs">или</span>
          <div className="flex-1 h-px bg-gray-800" />
        </div>

        <button
          onClick={onLoadSample}
          className="mt-6 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 text-purple-300 hover:from-purple-600/30 hover:to-blue-600/30 hover:border-purple-500/50 transition-all flex items-center justify-center gap-2"
        >
          <FolderUp size={16} />
          Загрузить демо-проект
        </button>

        <div className="mt-8 grid grid-cols-3 gap-3">
          <div className="text-center p-3 rounded-xl bg-gray-800/30 border border-gray-800/50">
            <FileCode size={18} className="mx-auto mb-1 text-blue-400" />
            <span className="text-[11px] text-gray-400">Анализ кода</span>
          </div>
          <div className="text-center p-3 rounded-xl bg-gray-800/30 border border-gray-800/50">
            <Sparkles size={18} className="mx-auto mb-1 text-purple-400" />
            <span className="text-[11px] text-gray-400">Авто-исправление</span>
          </div>
          <div className="text-center p-3 rounded-xl bg-gray-800/30 border border-gray-800/50">
            <Upload size={18} className="mx-auto mb-1 text-emerald-400" />
            <span className="text-[11px] text-gray-400">Запуск проекта</span>
          </div>
        </div>

        {onShowSetupGuide && (
          <button
            onClick={onShowSetupGuide}
            className="mt-6 w-full py-2.5 px-4 rounded-xl border border-gray-700 text-gray-400 hover:text-gray-200 hover:border-gray-600 hover:bg-gray-800/30 transition-all text-xs flex items-center justify-center gap-2"
          >
            <span>📘</span>
            Как запустить локально на Windows?
          </button>
        )}

        {onShowFixWorkspace && (
          <button
            onClick={onShowFixWorkspace}
            className="mt-3 w-full py-2.5 px-4 rounded-xl border border-yellow-700/50 bg-yellow-900/10 text-yellow-400 hover:text-yellow-300 hover:border-yellow-600 hover:bg-yellow-900/20 transition-all text-xs flex items-center justify-center gap-2"
          >
            <span>⚠️</span>
            У меня файл "workspace" без расширения — что делать?
          </button>
        )}
      </div>
    </div>
  );
}

function getLanguage(ext: string): string {
  const map: Record<string, string> = {
    ts: 'typescript', tsx: 'typescript', js: 'javascript', jsx: 'javascript',
    json: 'json', md: 'markdown', css: 'css', html: 'html',
    py: 'python', rb: 'ruby', go: 'go', rs: 'rust'
  };
  return map[ext] || 'text';
}
