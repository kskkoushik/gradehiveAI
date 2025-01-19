import React, { useState } from 'react';
import { Search, Github } from 'lucide-react';

interface Props {
  onAnalyze: (owner: string, repo: string) => void;
}

export function RepositoryInput({ onAnalyze }: Props) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const urlObj = new URL(url);
      const [, owner, repo] = urlObj.pathname.split('/');
      if (owner && repo) {
        onAnalyze(owner, repo.replace('.git', ''));
      }
    } catch (error) {
      console.error('Invalid GitHub URL');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-center mb-8">
        <Github className="w-10 h-10 mr-3" />
        <h1 className="text-3xl font-bold">Repository Analyzer</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter GitHub repository URL"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Analyze
        </button>
      </form>
    </div>
  );
}