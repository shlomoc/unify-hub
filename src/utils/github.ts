/**
 * Extracts owner and repository information from a GitHub URL.
 * 
 * @param {string} url - The GitHub repository URL.
 * @returns {{ owner: string, repo: string }} An object containing the owner and repository names.
 * @throws {Error} If the URL format is invalid.
 */
export const getGithubRepoInfo = (url: string) => {
  const regex = /github\.com\/([^/]+)\/([^/]+)/;
  const match = url.match(regex);
  if (!match) throw new Error('Invalid GitHub URL');
  return { owner: match[1], repo: match[2] };
};

/**
 * Fetches the README content from a GitHub repository.
 * 
 * @param {string} url - The GitHub repository URL.
 * @returns {Promise<string>} The README content as text.
 * @throws {Error} If the README fetch fails or if the URL is invalid.
 */
export const fetchReadmeContent = async (url: string): Promise<string> => {
  try {
    const { owner, repo } = getGithubRepoInfo(url);
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      {
        headers: {
          Accept: 'application/vnd.github.raw+json',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch README');
    }
    
    return await response.text();
  } catch (error) {
    console.error('Error fetching README:', error);
    throw error;
  }
};