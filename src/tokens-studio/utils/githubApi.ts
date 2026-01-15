// GitHub API utilities for browsing repositories and loading token files

export interface GitHubItem {
  name: string;
  path: string;
  type: 'file' | 'dir';
  sha: string;
  size: number;
  url: string;
  download_url: string | null;
}

export interface RepoInfo {
  owner: string;
  repo: string;
  branch?: string;
}

/**
 * Parse a GitHub URL to extract owner, repo, and optional path
 */
export function parseGitHubUrl(url: string): RepoInfo | null {
  // Handle various GitHub URL formats
  const patterns = [
    // https://github.com/owner/repo
    /github\.com\/([^\/]+)\/([^\/]+)\/?$/,
    // https://github.com/owner/repo/tree/branch
    /github\.com\/([^\/]+)\/([^\/]+)\/tree\/([^\/]+)/,
    // https://github.com/owner/repo/blob/branch/path
    /github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return {
        owner: match[1],
        repo: match[2].replace(/\.git$/, ''),
        branch: match[3],
      };
    }
  }

  return null;
}

/**
 * Fetch repository contents at a given path
 */
export async function fetchRepoContents(
  owner: string,
  repo: string,
  path: string = ''
): Promise<GitHubItem[]> {
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  const response = await fetch(apiUrl, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Repository or path not found: ${owner}/${repo}/${path}`);
    }
    if (response.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Please try again later.');
    }
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  // Single file returns an object, directory returns array
  if (!Array.isArray(data)) {
    return [data];
  }

  return data;
}

/**
 * Fetch the raw content of a file
 */
export async function fetchFileContent(
  owner: string,
  repo: string,
  path: string
): Promise<string> {
  const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${path}`;

  const response = await fetch(rawUrl);

  if (!response.ok) {
    // Try with master branch as fallback
    const masterUrl = `https://raw.githubusercontent.com/${owner}/${repo}/master/${path}`;
    const masterResponse = await fetch(masterUrl);

    if (!masterResponse.ok) {
      throw new Error(`Failed to fetch file: ${path}`);
    }

    return masterResponse.text();
  }

  return response.text();
}

/**
 * Recursively fetch all JSON files in a repository
 */
export async function fetchAllJsonFiles(
  owner: string,
  repo: string,
  path: string = ''
): Promise<{ path: string; content: string }[]> {
  const items = await fetchRepoContents(owner, repo, path);
  const results: { path: string; content: string }[] = [];

  for (const item of items) {
    if (item.type === 'dir') {
      // Recurse into directories
      const subResults = await fetchAllJsonFiles(owner, repo, item.path);
      results.push(...subResults);
    } else if (item.type === 'file' && item.name.endsWith('.json')) {
      // Fetch JSON file content
      try {
        const content = await fetchFileContent(owner, repo, item.path);
        results.push({ path: item.path, content });
      } catch (error) {
        console.warn(`Failed to fetch ${item.path}:`, error);
      }
    }
  }

  return results;
}

/**
 * Check if a directory contains token files (has .json files)
 */
export function hasJsonFiles(items: GitHubItem[]): boolean {
  return items.some(item =>
    item.type === 'file' && item.name.endsWith('.json')
  );
}

/**
 * Sort items: directories first, then files, alphabetically
 */
export function sortGitHubItems(items: GitHubItem[]): GitHubItem[] {
  return [...items].sort((a, b) => {
    // Directories first
    if (a.type === 'dir' && b.type !== 'dir') return -1;
    if (a.type !== 'dir' && b.type === 'dir') return 1;
    // Then alphabetically
    return a.name.localeCompare(b.name);
  });
}
