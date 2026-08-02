const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Make sure output folder exists
const dataDir = path.join(__dirname, "..", "src", "data");
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const outputPath = path.join(dataDir, "github-repos.json");

console.log("Fetching GitHub repositories for build...");

let repos = [];

// Try fetching using GitHub CLI since user is logged in
try {
    console.log("Attempting to fetch via GitHub CLI...");
    const cliOutput = execSync(
        `gh repo list --limit 100 --json name,description,url,homepageUrl,stargazerCount,forkCount,primaryLanguage,updatedAt,isPrivate`,
        { encoding: "utf-8" }
    );
    const parsed = JSON.parse(cliOutput);
    repos = parsed
        .filter(repo => !repo.isPrivate) // Prevent private metadata exposure
        .map(repo => ({
            id: repo.name,
            name: repo.name,
            description: repo.description,
            html_url: repo.url,
            homepage: repo.homepageUrl || null,
            stargazers_count: repo.stargazerCount || 0,
            forks_count: repo.forkCount || 0,
            language: repo.primaryLanguage ? repo.primaryLanguage.name : null,
            updated_at: repo.updatedAt,
            topics: [],
            private: repo.isPrivate
        }));
    console.log(`Successfully fetched ${repos.length} public repositories via GitHub CLI.`);
} catch (cliError) {
    console.warn("GitHub CLI fetch failed. Attempting API fetch with token...", cliError.message);
    
    // Fallback to token if CLI fails (e.g., in CI/CD pipeline)
    const token = process.env.GITHUB_PAT;
    if (token) {
        try {
            const res = execSync(
                `curl -s -H "Authorization: Bearer ${token}" -H "Accept: application/vnd.github+json" https://api.github.com/user/repos?per_page=100&type=owner`,
                { encoding: "utf-8" }
            );
            const data = JSON.parse(res);
            repos = data
                .filter((repo) => !repo.private) // Prevent private metadata exposure
                .map((repo) => ({
                    id: repo.id,
                    name: repo.name,
                    description: repo.description,
                    html_url: repo.html_url,
                    homepage: repo.homepage,
                    stargazers_count: repo.stargazers_count,
                    forks_count: repo.forks_count,
                    language: repo.language,
                    updated_at: repo.updated_at,
                    topics: repo.topics || [],
                    private: repo.private
                }));
            console.log(`Successfully fetched ${repos.length} public repositories via GitHub API Token.`);
        } catch (apiError) {
            console.error("API Fetch failed:", apiError.message);
        }
    } else {
        console.error("No GITHUB_PAT token found in environment and GitHub CLI failed.");
    }
}

// Write to static file
fs.writeFileSync(outputPath, JSON.stringify(repos, null, 2), "utf-8");
console.log(`Saved static repository data to: ${outputPath}`);
