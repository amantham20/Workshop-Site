/**
 * GitHub API client for fetching repository code
 */

export interface GitHubConfig {
  owner: string;
  repo: string;
  branch?: string;
  token?: string; // Optional GitHub token for higher rate limits
}

export interface GitHubFile {
  path: string;
  content: string;
  sha: string;
  size: number;
  url: string;
  githubUrl: string;
}

export interface GitHubTreeItem {
  path: string;
  mode: string;
  type: "blob" | "tree";
  sha: string;
  size?: number;
  url: string;
}

/**
 * GitHub API client
 */
export class GitHubClient {
  private owner: string;
  private repo: string;
  private branch: string;
  private token?: string;
  private baseUrl = "https://api.github.com";
  private requestDelay = 1000; // 1 second between requests for rate limiting

  constructor(config: GitHubConfig) {
    this.owner = config.owner;
    this.repo = config.repo;
    this.branch = config.branch || "main";
    this.token = config.token;
  }

  /**
   * Get headers for GitHub API requests
   */
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "Gray-Matter-Workshop-Bot/1.0 (Educational FRC Workshop)",
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * Make a GitHub API request with rate limiting
   */
  private async request<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: this.getHeaders(),
      });

      // Check rate limit
      const remaining = response.headers.get("x-ratelimit-remaining");
      const resetTime = response.headers.get("x-ratelimit-reset");

      if (remaining === "0" && resetTime) {
        const resetDate = new Date(parseInt(resetTime) * 1000);
        throw new Error(
          `GitHub API rate limit exceeded. Resets at ${resetDate.toISOString()}`
        );
      }

      if (!response.ok) {
        throw new Error(
          `GitHub API error: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      throw error;
    }
  }

  /**
   * Get the repository tree (file structure)
   */
  async getTree(path: string = "", recursive: boolean = true): Promise<GitHubTreeItem[]> {
    const endpoint = `/repos/${this.owner}/${this.repo}/git/trees/${this.branch}${
      recursive ? "?recursive=1" : ""
    }`;

    interface TreeResponse {
      sha: string;
      url: string;
      tree: GitHubTreeItem[];
      truncated: boolean;
    }

    const response = await this.request<TreeResponse>(endpoint);

    if (response.truncated) {
      console.warn(
        "Warning: Tree response was truncated. Some files may be missing."
      );
    }

    // Filter by path if specified
    if (path) {
      return response.tree.filter((item) => item.path.startsWith(path));
    }

    return response.tree;
  }

  /**
   * Get file content from GitHub
   */
  async getFile(path: string): Promise<GitHubFile> {
    const endpoint = `/repos/${this.owner}/${this.repo}/contents/${path}?ref=${this.branch}`;

    interface FileResponse {
      name: string;
      path: string;
      sha: string;
      size: number;
      url: string;
      html_url: string;
      git_url: string;
      download_url: string;
      type: string;
      content: string;
      encoding: string;
    }

    const response = await this.request<FileResponse>(endpoint);

    if (response.type !== "file") {
      throw new Error(`Path ${path} is not a file`);
    }

    // Decode base64 content
    const content = Buffer.from(response.content, "base64").toString("utf-8");

    return {
      path: response.path,
      content,
      sha: response.sha,
      size: response.size,
      url: response.url,
      githubUrl: response.html_url,
    };
  }

  /**
   * Get multiple files with rate limiting and progress
   */
  async getFiles(
    paths: string[],
    onProgress?: (completed: number, total: number, currentFile: string) => void
  ): Promise<GitHubFile[]> {
    const files: GitHubFile[] = [];

    for (let i = 0; i < paths.length; i++) {
      const path = paths[i];

      try {
        onProgress?.(i, paths.length, path);
        const file = await this.getFile(path);
        files.push(file);

        // Rate limiting delay (except for last file)
        if (i < paths.length - 1) {
          await this.delay(this.requestDelay);
        }
      } catch (error) {
        console.error(`Failed to fetch ${path}:`, error);
        // Continue with other files
      }
    }

    onProgress?.(paths.length, paths.length, "");

    return files;
  }

  /**
   * Get all Java files from the repository
   */
  async getJavaFiles(): Promise<GitHubFile[]> {
    console.log(`Fetching Java files from ${this.owner}/${this.repo}...`);

    // Get file tree
    const tree = await this.getTree();

    // Filter Java files in src/ directory
    const javaFiles = tree.filter(
      (item) =>
        item.type === "blob" &&
        item.path.endsWith(".java") &&
        item.path.startsWith("src/")
    );

    console.log(`Found ${javaFiles.length} Java files`);

    // Fetch file contents
    const files = await this.getFiles(
      javaFiles.map((f) => f.path),
      (completed, total, currentFile) => {
        if (currentFile) {
          console.log(`[${completed}/${total}] Fetching ${currentFile}`);
        }
      }
    );

    return files;
  }

  /**
   * Get files matching a glob pattern
   */
  async getFilesByPattern(pattern: RegExp): Promise<GitHubFile[]> {
    const tree = await this.getTree();
    const matchingFiles = tree.filter(
      (item) => item.type === "blob" && pattern.test(item.path)
    );

    console.log(`Found ${matchingFiles.length} files matching pattern`);

    return await this.getFiles(
      matchingFiles.map((f) => f.path),
      (completed, total, currentFile) => {
        if (currentFile) {
          console.log(`[${completed}/${total}] Fetching ${currentFile}`);
        }
      }
    );
  }

  /**
   * Get rate limit status
   */
  async getRateLimit(): Promise<{
    limit: number;
    remaining: number;
    reset: Date;
  }> {
    interface RateLimitResponse {
      resources: {
        core: {
          limit: number;
          remaining: number;
          reset: number;
        };
      };
    }

    const response = await this.request<RateLimitResponse>("/rate_limit");

    return {
      limit: response.resources.core.limit,
      remaining: response.resources.core.remaining,
      reset: new Date(response.resources.core.reset * 1000),
    };
  }

  /**
   * Delay helper for rate limiting
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Create a GitHub client from environment or config
 */
export function createGitHubClient(config: GitHubConfig): GitHubClient {
  // Use environment token if available
  const token = config.token || process.env.GITHUB_TOKEN;

  return new GitHubClient({
    ...config,
    token,
  });
}
