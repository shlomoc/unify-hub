export const getGithubRepoInfo = (url: string) => {
  const regex = /github\.com\/([^/]+)\/([^/]+)/;
  const match = url.match(regex);
  if (!match) throw new Error('Invalid GitHub URL');
  return { owner: match[1], repo: match[2] };
};

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