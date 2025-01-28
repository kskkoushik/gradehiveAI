import React, { useState } from 'react';
import { RepositoryInput } from './components/RepositoryInput';
import { AnalysisReport as AnalysisReportComponent } from './components/AnalysisReport';
import { GitHubService } from './services/github';
import { GeminiService } from './services/gemini';
import type { AnalysisReport } from './types';

function App() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeRepository = async (owner: string, repo: string) => {
    setLoading(true);
    setError(null);

    try {
      const githubService = new GitHubService();
      const geminiService = new GeminiService(import.meta.env.VITE_GEMINI_API_KEY);

      // Fetch repository data
      const repoData = await githubService.getRepository(owner, repo);
      const commits = await githubService.getCommits(owner, repo);
      const contents = await githubService.getContents(owner, repo);

      // Analyze files
      const fileAnalyses = await Promise.all(
        contents
          .filter((item: any) => item.type === 'file')
          .map(async (file: any) => {
            const content = await fetch(file.download_url).then(res => res.text());
            const analysis = await geminiService.analyzeCode(content, file.name.split('.').pop() || '');
            
            // Parse analysis into structured data using AI
            const sections = analysis.split('\n\n');
            return {
              path: file.path,
              content,
              suggestions: sections[1]?.split('\n') || [],
              vulnerabilities: sections[2]?.split('\n') || [],
              improvements: sections[3]?.split('\n') || [],
            };
          })
      );

      // Generate summary
      const summary = await geminiService.generateSummary(
        fileAnalyses.map(analysis => analysis.content)
      );

      // Calculate score based on analysis results
      const score = Math.max(
        0,
        100 -
          fileAnalyses.reduce(
            (acc, analysis) =>
              acc +
              analysis.vulnerabilities.length * 5 +
              analysis.suggestions.length * 2,
            0
          )
      );

      setReport({
        repository: {
          name: repoData.name,
          owner: repoData.owner.login,
          description: repoData.description,
          url: repoData.html_url,
          stars: repoData.stargazers_count,
          forks: repoData.forks_count,
          issues: repoData.open_issues_count,
          lastUpdated: repoData.updated_at,
        },
        commits: commits.map((commit: any) => ({
          hash: commit.sha,
          message: commit.commit.message,
          author: commit.commit.author.name,
          date: commit.commit.author.date,
        })),
        files: fileAnalyses,
        summary,
        score,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <RepositoryInput onAnalyze={analyzeRepository} />
      
      {loading && (
        <div className="flex justify-center items-center mt-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {error && (
        <div className="max-w-2xl mx-auto mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {report && !loading && <AnalysisReportComponent report={report} />}
    </div>
  );
}

export default App;
