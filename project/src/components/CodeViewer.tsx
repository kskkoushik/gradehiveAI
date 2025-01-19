import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FileType } from 'lucide-react';

interface Props {
  files: Array<{
    path: string;
    content: string;
  }>;
}

export function CodeViewer({ files }: Props) {
  const [selectedFile, setSelectedFile] = React.useState(files[0]);

  const getLanguage = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const languageMap: { [key: string]: string } = {
      js: 'javascript',
      jsx: 'jsx',
      ts: 'typescript',
      tsx: 'tsx',
      py: 'python',
      java: 'java',
      rb: 'ruby',
      go: 'go',
      rs: 'rust',
      php: 'php',
      css: 'css',
      html: 'html',
      json: 'json',
      yml: 'yaml',
      yaml: 'yaml',
      md: 'markdown',
    };
    return languageMap[ext || ''] || 'text';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="flex">
        {/* File list sidebar */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto max-h-[600px]">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Files</h3>
          </div>
          <div className="space-y-1">
            {files.map((file) => (
              <button
                key={file.path}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left px-4 py-2 flex items-center space-x-2 hover:bg-gray-100 ${
                  selectedFile.path === file.path ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                }`}
              >
                <FileType size={16} />
                <span className="text-sm truncate">{file.path}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Code viewer */}
        <div className="flex-1 overflow-auto max-h-[600px]">
          <div className="p-4 bg-gray-800 text-white">
            <h3 className="text-sm font-mono">{selectedFile.path}</h3>
          </div>
          <SyntaxHighlighter
            language={getLanguage(selectedFile.path)}
            style={vscDarkPlus}
            showLineNumbers
            customStyle={{
              margin: 0,
              borderRadius: 0,
              maxHeight: '550px',
            }}
          >
            {selectedFile.content}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
}