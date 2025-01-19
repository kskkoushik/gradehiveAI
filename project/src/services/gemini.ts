import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async analyzeCode(code: string, language: string): Promise<string> {
    const prompt = `Analyze this ${language} code for potential improvements, security issues, and best practices. Format your response in markdown with clear sections and bullet points.

${code}

Please provide a detailed analysis including:

## Code Quality Assessment
- Overall code structure and organization
- Code readability and maintainability
- Naming conventions and consistency
- Code duplication and modularity

## Security Vulnerabilities
- Potential security risks
- Input validation issues
- Authentication/authorization concerns
- Data exposure risks

## Performance Optimizations
- Performance bottlenecks
- Resource usage concerns
- Caching opportunities
- Algorithm efficiency

## Best Practices Suggestions
- Industry standard practices
- Framework-specific recommendations
- Code style improvements
- Documentation needs

## Overall Recommendations
- Critical issues to address
- Priority improvements
- Long-term maintenance suggestions
- Positive aspects to maintain`;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }

  async generateSummary(analysis: string[]): Promise<string> {
    const prompt = `Based on these code analysis results, provide a comprehensive summary in markdown format:

${analysis.join('\n')}

Format your response with the following sections:

## Executive Summary
Brief overview of the codebase health and major findings

## Key Findings
- Critical issues discovered
- Major strengths identified
- Areas needing immediate attention

## Security Assessment
- Security vulnerabilities found
- Risk levels and potential impacts
- Mitigation recommendations

## Performance Analysis
- Performance bottlenecks
- Resource usage concerns
- Optimization opportunities

## Code Quality
- Overall code health
- Maintainability assessment
- Technical debt evaluation

## Recommendations
1. Immediate actions needed
2. Short-term improvements
3. Long-term strategic changes

## Next Steps
Prioritized list of actions to improve the codebase`;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }
}