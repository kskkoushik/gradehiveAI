export interface Repository {
  name: string;
  owner: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  issues: number;
  lastUpdated: string;
}

export interface CommitInfo {
  hash: string;
  message: string;
  author: string;
  date: string;
}

export interface FileAnalysis {
  path: string;
  content: string;
  suggestions: string[];
  vulnerabilities: string[];
  improvements: string[];
}

export interface AnalysisReport {
  repository: Repository;
  commits: CommitInfo[];
  files: FileAnalysis[];
  summary: string;
  score: number;
}