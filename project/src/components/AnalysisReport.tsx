import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FileText, AlertTriangle, Lightbulb, CheckCircle, Code, Link as LinkIcon, MessageSquare } from 'lucide-react';
import { AnalysisReport as AnalysisReportType } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeViewer } from './CodeViewer';
import { ChatBot } from './ChatBot';
import { GeminiService } from '../services/gemini';

interface Props {
  report: AnalysisReportType;
}

export function AnalysisReport({ report }: Props) {
  const [activeTab, setActiveTab] = useState<'overview' | 'code' | 'vulnerabilities' | 'suggestions' | 'chat'>('overview');
  const geminiService = new GeminiService(import.meta.env.VITE_GEMINI_API_KEY);
  
  const chartData = report.files.map(file => ({
    name: file.path,
    suggestions: file.suggestions.length,
    vulnerabilities: file.vulnerabilities.length,
    improvements: file.improvements.length,
  }));

  const allVulnerabilities = report.files.flatMap(file => 
    file.vulnerabilities.map(vuln => ({ file: file.path, vulnerability: vuln }))
  );

  const allSuggestions = report.files.flatMap(file => 
    file.suggestions.map(sugg => ({ file: file.path, suggestion: sugg }))
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatBot files={report.files} geminiService={geminiService} />;
      case 'code':
        return (
          <CodeViewer
            files={report.files.map(f => ({ path: f.path, content: f.content }))}
          />
        );
      case 'vulnerabilities':
        return (
          <div className="space-y-4">
            {allVulnerabilities.map((item, index) => (
              <div key={index} className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-red-900">{item.file}</h4>
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      className="text-red-700 prose prose-sm max-w-none"
                    >
                      {item.vulnerability}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'suggestions':
        return (
          <div className="space-y-4">
            {allSuggestions.map((item, index) => (
              <div key={index} className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <Lightbulb className="w-5 h-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-900">{item.file}</h4>
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      className="text-blue-700 prose prose-sm max-w-none"
                    >
                      {item.suggestion}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return (
          <>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Repository Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <FileText className="w-8 h-8 text-blue-600 mb-2" />
                  <h3 className="text-lg font-semibold">Files Analyzed</h3>
                  <p className="text-2xl font-bold">{report.files.length}</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <AlertTriangle className="w-8 h-8 text-red-600 mb-2" />
                  <h3 className="text-lg font-semibold">Vulnerabilities</h3>
                  <p className="text-2xl font-bold">{allVulnerabilities.length}</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <Lightbulb className="w-8 h-8 text-yellow-600 mb-2" />
                  <h3 className="text-lg font-semibold">Suggestions</h3>
                  <p className="text-2xl font-bold">{allSuggestions.length}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
                  <h3 className="text-lg font-semibold">Score</h3>
                  <p className="text-2xl font-bold">{report.score}/100</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Analysis Summary</h2>
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                className="prose prose-blue max-w-none"
              >
                {report.summary}
              </ReactMarkdown>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Repository Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Project Information</h3>
                  <dl className="space-y-2">
                    <div className="flex items-center">
                      <dt className="w-32 text-gray-500">Repository:</dt>
                      <dd className="flex items-center">
                        <a href={report.repository.url} className="text-blue-600 hover:underline flex items-center" target="_blank" rel="noopener noreferrer">
                          {report.repository.name}
                          <LinkIcon className="w-4 h-4 ml-1" />
                        </a>
                      </dd>
                    </div>
                    <div className="flex items-center">
                      <dt className="w-32 text-gray-500">Owner:</dt>
                      <dd>{report.repository.owner}</dd>
                    </div>
                    <div className="flex items-center">
                      <dt className="w-32 text-gray-500">Stars:</dt>
                      <dd>{report.repository.stars}</dd>
                    </div>
                    <div className="flex items-center">
                      <dt className="w-32 text-gray-500">Forks:</dt>
                      <dd>{report.repository.forks}</dd>
                    </div>
                    <div className="flex items-center">
                      <dt className="w-32 text-gray-500">Open Issues:</dt>
                      <dd>{report.repository.issues}</dd>
                    </div>
                    <div className="flex items-center">
                      <dt className="w-32 text-gray-500">Last Updated:</dt>
                      <dd>{new Date(report.repository.lastUpdated).toLocaleDateString()}</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Recent Commits</h3>
                  <div className="space-y-3">
                    {report.commits.slice(0, 5).map((commit) => (
                      <div key={commit.hash} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-mono text-gray-500">{commit.hash.slice(0, 7)}</p>
                        <p className="text-sm">{commit.message}</p>
                        <p className="text-xs text-gray-500">
                          {commit.author} • {new Date(commit.date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">File Analysis Distribution</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="suggestions" fill="#3B82F6" name="Suggestions" />
                    <Bar dataKey="vulnerabilities" fill="#EF4444" name="Vulnerabilities" />
                    <Bar dataKey="improvements" fill="#10B981" name="Improvements" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`${
                activeTab === 'code'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Code className="w-4 h-4 mr-2" />
              Code Browser
            </button>
            <button
              onClick={() => setActiveTab('vulnerabilities')}
              className={`${
                activeTab === 'vulnerabilities'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Vulnerabilities ({allVulnerabilities.length})
            </button>
            <button
              onClick={() => setActiveTab('suggestions')}
              className={`${
                activeTab === 'suggestions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              Suggestions ({allSuggestions.length})
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`${
                activeTab === 'chat'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat Assistant
            </button>
          </nav>
        </div>
      </div>

      {renderTabContent()}
    </div>
  );
}