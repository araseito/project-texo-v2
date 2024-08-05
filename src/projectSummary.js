const projectStructure = `
project-texo-v2/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── public/
│   └── index.html
├── src/
│   ├── consolidatedApp.js
│   └── projectSummary.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
`;

const componentSummary = {
  App: "Main application component that orchestrates the UI and logic flow",
  CodeEditor: "Component for displaying and editing generated code",
  GitHubStatus: "Component for showing the status of GitHub operations",
  RepositorySelector: "Component for selecting and changing the target GitHub repository",
  ChangeInstructions: "Component for displaying and editing change instructions for GitHub updates",
};

const serviceSummary = {
  aiService: "Handles communication with AI API for code generation and instruction formatting",
  githubService: "Manages interactions with GitHub API for repository updates and change applications",
  updateManager: "Manages the process of updating multiple files with dependency tracking and rollback capabilities",
};

const mainFunctionality = `
1. User selects target GitHub repository
2. User inputs a prompt for code generation
3. AI generates code and change instructions based on the prompt
4. Generated code is displayed in the CodeEditor
5. Change instructions are displayed in the ChangeInstructions component
6. User can edit the generated code and change instructions
7. UpdateManager handles the process of applying changes to multiple files
8. Code and instructions can be pushed to the selected GitHub repository
9. GitHub operation status is displayed
`;

const technologiesUsed = [
  "React",
  "Axios for API calls",
  "GitHub Actions for CI/CD",
  "CSS for styling",
];

const projectDescription = `
Project Texo-v2 is a web application that integrates AI-powered code generation with GitHub repository management. 
It allows users to select a target GitHub repository, generate code using AI, and apply changes directly to the repository. 
The application is built with React and uses Axios for API calls to both the AI service and GitHub.

Key Features:
- AI-powered code generation based on user prompts
- Direct interaction with GitHub repositories
- Real-time code editing and preview
- Automated change application process
- GitHub operation status tracking

The application is structured to separate concerns, with distinct components for different functionalities and 
services for handling external API interactions. The UpdateManager service ensures that file changes are tracked 
and can be rolled back if necessary.

The project uses GitHub Actions for continuous integration and deployment, automating the build and deploy process 
to GitHub Pages.
`;

export {
  projectStructure,
  componentSummary,
  serviceSummary,
  mainFunctionality,
  technologiesUsed,
  projectDescription
};
