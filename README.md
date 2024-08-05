# Project Texo-v2

Project Texo-v2 is a web application that integrates AI-powered code generation with GitHub repository management. It allows users to select a target GitHub repository, generate code using AI, and apply changes directly to the repository.

## Key Features

- AI-powered code generation based on user prompts
- Direct interaction with GitHub repositories
- Real-time code editing and preview
- Automated change application process
- GitHub operation status tracking

## Technologies Used

- React
- Axios for API calls
- GitHub Actions for CI/CD
- CSS for styling

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the application: `npm start`

## Deployment

This project uses GitHub Actions for continuous integration and deployment. Ensure you have the necessary secrets (`GH_TOKEN` and `OPENAI_API_KEY`) set in your GitHub repository settings.

## Project Structure

project-texo-v2/
├── .github/
│ └── workflows/
│ └── deploy.yml
├── public/
│ └── index.html
├── src/
│ ├── consolidatedApp.js
│ └── projectSummary.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md

## License

This project is licensed under the ISC License.
