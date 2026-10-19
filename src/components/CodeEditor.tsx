import React from 'react';
import { FileNode } from '../types';
import { Code2 } from 'lucide-react';

interface CodeEditorProps {
  file: FileNode | null;
}

function findFile(nodes: FileNode[], path: string): FileNode | null {
  for (const node of nodes) {
    if (node.path === path) return node;
    if (node.children) {
      const found = findFile(node.children, path);
      if (found) return found;
    }
  }
  return null;
}

export default function CodeEditor({ file }: CodeEditorProps) {
  if (!file || file.type === 'directory') {
    return (
      <div className="h-full flex items-center justify-center bg-gray-950/50">
        <div className="text-center">
          <Code2 size={32} className="text-gray-700 mx-auto mb-2" />
          <p className="text-gray-600 text-sm">Выберите файл для просмотра</p>
        </div>
      </div>
    );
  }

  const lines = (file.content || '').split('\n');

  return (
    <div className="h-full flex flex-col bg-gray-950">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-800 bg-gray-900/50">
        <Code2 size={14} className="text-gray-400" />
        <span className="text-xs text-gray-300">{file.path}</span>
        <span className="ml-auto text-[10px] text-gray-600">{file.language}</span>
      </div>
      <div className="flex-1 overflow-auto font-mono text-xs">
        <table className="w-full">
          <tbody>
            {lines.map((line, i) => (
              <tr key={i} className="hover:bg-gray-800/30">
                <td className="px-3 py-0 text-right text-gray-600 select-none w-10 border-r border-gray-800/50">
                  {i + 1}
                </td>
                <td className="px-3 py-0 text-gray-300 whitespace-pre">
                  {highlightSyntax(line, file.language || '')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function highlightSyntax(line: string, language: string): React.ReactNode {
  if (language === 'typescript' || language === 'javascript') {
    // Simple syntax highlighting
    const keywords = /\b(import|export|from|const|let|var|function|class|async|await|return|if|else|new|this|private|public|type|interface|throw|try|catch)\b/g;
    const strings = /(['"`])(.*?)\1/g;
    const comments = /(\/\/.*$)/g;
    const types = /\b(string|number|boolean|any|void|Promise|Array)\b/g;

    let result = line;
    // We'll just return the line as-is for simplicity, with basic coloring
    return <span>{line}</span>;
  }
  return <span>{line}</span>;
}

export { findFile };
