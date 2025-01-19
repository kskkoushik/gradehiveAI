export class GitHubService {
  private baseUrl: string;
  private token?: string;

  constructor(token?: string) {
    this.baseUrl = 'https://api.github.com';
    this.token = token;
  }

  private async fetch(endpoint: string) {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
    };

    if (this.token) {
      headers['Authorization'] = `token ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, { headers });
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }
    return response.json();
  }

  async getRepository(owner: string, repo: string) {
    return this.fetch(`/repos/${owner}/${repo}`);
  }

  async getCommits(owner: string, repo: string) {
    return this.fetch(`/repos/${owner}/${repo}/commits`);
  }

  async getContents(owner: string, repo: string, path: string = '') {
    return this.fetch(`/repos/${owner}/${repo}/contents/${path}`);
  }

  async getRateLimit() {
    return this.fetch('/rate_limit');
  }
}