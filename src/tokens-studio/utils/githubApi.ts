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

// ============================================================================
// Write Operations (require authentication)
// ============================================================================

export interface GitHubAuth {
  token: string;
}

export interface CommitResult {
  sha: string;
  url: string;
  message: string;
}

export interface PullRequestResult {
  number: number;
  url: string;
  title: string;
}

export interface FileUpdate {
  path: string;
  content: string;
  sha?: string; // Required for updating existing files
}

/**
 * Get the SHA of a file (needed for updates)
 */
export async function getFileSha(
  owner: string,
  repo: string,
  path: string,
  auth: GitHubAuth
): Promise<string | null> {
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  const response = await fetch(apiUrl, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `token ${auth.token}`,
    },
  });

  if (response.status === 404) {
    return null; // File doesn't exist
  }

  if (!response.ok) {
    throw new Error(`Failed to get file SHA: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.sha;
}

/**
 * Commit a single file to the repository
 */
export async function commitFile(
  owner: string,
  repo: string,
  path: string,
  content: string,
  message: string,
  auth: GitHubAuth,
  branch: string = 'main'
): Promise<CommitResult> {
  // Get current SHA if file exists
  const sha = await getFileSha(owner, repo, path, auth);

  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  const body: Record<string, string> = {
    message,
    content: btoa(unescape(encodeURIComponent(content))), // Base64 encode
    branch,
  };

  if (sha) {
    body.sha = sha;
  }

  const response = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `token ${auth.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to commit file: ${error.message || response.statusText}`);
  }

  const data = await response.json();
  return {
    sha: data.commit.sha,
    url: data.commit.html_url,
    message: data.commit.message,
  };
}

/**
 * Commit multiple files in a single commit using the Git Data API
 * This creates a proper commit with all changes together
 */
export async function commitMultipleFiles(
  owner: string,
  repo: string,
  files: FileUpdate[],
  message: string,
  auth: GitHubAuth,
  branch: string = 'main'
): Promise<CommitResult> {
  const baseUrl = `https://api.github.com/repos/${owner}/${repo}`;
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'Authorization': `token ${auth.token}`,
    'Content-Type': 'application/json',
  };

  // 1. Get the current commit SHA for the branch
  const refResponse = await fetch(`${baseUrl}/git/refs/heads/${branch}`, { headers });
  if (!refResponse.ok) {
    throw new Error(`Failed to get branch ref: ${refResponse.statusText}`);
  }
  const refData = await refResponse.json();
  const currentCommitSha = refData.object.sha;

  // 2. Get the current tree SHA
  const commitResponse = await fetch(`${baseUrl}/git/commits/${currentCommitSha}`, { headers });
  if (!commitResponse.ok) {
    throw new Error(`Failed to get commit: ${commitResponse.statusText}`);
  }
  const commitData = await commitResponse.json();
  const baseTreeSha = commitData.tree.sha;

  // 3. Create blobs for each file
  const tree = await Promise.all(
    files.map(async (file) => {
      const blobResponse = await fetch(`${baseUrl}/git/blobs`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          content: file.content,
          encoding: 'utf-8',
        }),
      });

      if (!blobResponse.ok) {
        throw new Error(`Failed to create blob for ${file.path}: ${blobResponse.statusText}`);
      }

      const blobData = await blobResponse.json();
      return {
        path: file.path,
        mode: '100644' as const,
        type: 'blob' as const,
        sha: blobData.sha,
      };
    })
  );

  // 4. Create a new tree
  const treeResponse = await fetch(`${baseUrl}/git/trees`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      base_tree: baseTreeSha,
      tree,
    }),
  });

  if (!treeResponse.ok) {
    throw new Error(`Failed to create tree: ${treeResponse.statusText}`);
  }
  const treeData = await treeResponse.json();

  // 5. Create a new commit
  const newCommitResponse = await fetch(`${baseUrl}/git/commits`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      message,
      tree: treeData.sha,
      parents: [currentCommitSha],
    }),
  });

  if (!newCommitResponse.ok) {
    throw new Error(`Failed to create commit: ${newCommitResponse.statusText}`);
  }
  const newCommitData = await newCommitResponse.json();

  // 6. Update the branch reference
  const updateRefResponse = await fetch(`${baseUrl}/git/refs/heads/${branch}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      sha: newCommitData.sha,
    }),
  });

  if (!updateRefResponse.ok) {
    throw new Error(`Failed to update ref: ${updateRefResponse.statusText}`);
  }

  return {
    sha: newCommitData.sha,
    url: `https://github.com/${owner}/${repo}/commit/${newCommitData.sha}`,
    message: newCommitData.message,
  };
}

/**
 * Create a new branch from another branch
 */
export async function createBranch(
  owner: string,
  repo: string,
  newBranch: string,
  sourceBranch: string,
  auth: GitHubAuth
): Promise<void> {
  const baseUrl = `https://api.github.com/repos/${owner}/${repo}`;
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'Authorization': `token ${auth.token}`,
    'Content-Type': 'application/json',
  };

  // Get the SHA of the source branch
  const refResponse = await fetch(`${baseUrl}/git/refs/heads/${sourceBranch}`, { headers });
  if (!refResponse.ok) {
    throw new Error(`Failed to get source branch: ${refResponse.statusText}`);
  }
  const refData = await refResponse.json();
  const sha = refData.object.sha;

  // Create the new branch
  const createResponse = await fetch(`${baseUrl}/git/refs`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      ref: `refs/heads/${newBranch}`,
      sha,
    }),
  });

  if (!createResponse.ok) {
    const error = await createResponse.json();
    throw new Error(`Failed to create branch: ${error.message || createResponse.statusText}`);
  }
}

/**
 * Create a pull request
 */
export async function createPullRequest(
  owner: string,
  repo: string,
  title: string,
  body: string,
  headBranch: string,
  baseBranch: string,
  auth: GitHubAuth
): Promise<PullRequestResult> {
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/pulls`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `token ${auth.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      body,
      head: headBranch,
      base: baseBranch,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to create PR: ${error.message || response.statusText}`);
  }

  const data = await response.json();
  return {
    number: data.number,
    url: data.html_url,
    title: data.title,
  };
}

/**
 * Get the authenticated user's info
 */
export async function getAuthenticatedUser(auth: GitHubAuth): Promise<{
  login: string;
  avatar_url: string;
  name: string | null;
}> {
  const response = await fetch('https://api.github.com/user', {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `token ${auth.token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get user: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Verify that a token has the required permissions
 */
export async function verifyTokenPermissions(
  owner: string,
  repo: string,
  auth: GitHubAuth
): Promise<{ canRead: boolean; canWrite: boolean }> {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${auth.token}`,
      },
    });

    if (!response.ok) {
      return { canRead: false, canWrite: false };
    }

    const data = await response.json();
    return {
      canRead: true,
      canWrite: data.permissions?.push || data.permissions?.admin || false,
    };
  } catch {
    return { canRead: false, canWrite: false };
  }
}
