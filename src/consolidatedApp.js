import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { projectStructure, componentSummary, serviceSummary, mainFunctionality, technologiesUsed, projectDescription } from './projectSummary';

// Inline CSS
const styles = {
  body: {
    fontFamily: 'Arial, sans-serif',
    margin: 0,
    padding: 0,
    backgroundColor: '#f0f0f0',
  },
  app: {
    width: '80%',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#fff',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  header: {
    textAlign: 'center',
  },
  chatWindow: {
    border: '1px solid #ccc',
    padding: '10px',
    marginBottom: '20px',
  },
  messages: {
    maxHeight: '200px',
    overflowY: 'auto',
    marginBottom: '10px',
  },
  message: {
    padding: '5px',
    borderBottom: '1px solid #eee',
  },
  inputArea: {
    display: 'flex',
  },
  input: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px 0 0 4px',
  },
  button: {
    padding: '10px',
    border: '1px solid #ccc',
    backgroundColor: '#007bff',
    color: '#fff',
    borderRadius: '0 4px 4px 0',
    cursor: 'pointer',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
  programExecution: {
    width: '100%',
    height: '300px',
    border: 'none',
  },
  statusDisplay: {
    marginTop: '20px',
    padding: '10px',
    border: '1px solid #ccc',
    backgroundColor: '#f9f9f9',
  },
};

// Services
const generateCodeAndInstructions = async (prompt, currentRepo) => {
  try {
    const response = await axios.post('/api/generate', { prompt, currentRepo }, {
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    });
    return {
      generatedCode: response.data.generatedCode,
      changeInstructions: response.data.changeInstructions,
    };
  } catch (error) {
    console.error('Error generating code and instructions:', error);
    throw error;
  }
};

const getRepositories = async () => {
  try {
    const response = await axios.get('/api/github/repositories', {
      headers: { Authorization: `token ${process.env.GH_TOKEN}` },
    });
    return response.data.repositories;
  } catch (error) {
    console.error('Error fetching repositories:', error);
    throw error;
  }
};

const updateGithub = async (repo, code, instructions) => {
  try {
    const response = await axios.post('/api/github/update', { repo, code, instructions }, {
      headers: { Authorization: `token ${process.env.GH_TOKEN}` },
    });
    return response.data.message;
  } catch (error) {
    console.error('Error updating GitHub:', error);
    throw error;
  }
};

// UpdateManager Class
class UpdateManager {
  constructor(projectStructure) {
    this.dependencyGraph = this.buildDependencyGraph(projectStructure);
    this.updateQueue = [];
  }

  buildDependencyGraph(projectStructure) {
    // Implementation of dependency graph building
    return {};
  }

  queueUpdate(file, changes) {
    this.updateQueue.push({ file, changes });
  }

  async applyUpdates() {
    // Implementation of update application
  }

  // Other methods...
}

// Components
const ChatWindow = ({ messages, onSendMessage }) => {
  const [input, setInput] = useState('');

  const handleSendMessage = () => {
    onSendMessage(input);
    setInput('');
  };

  return (
    <div style={styles.chatWindow}>
      <div style={styles.messages}>
        {messages.map((msg, idx) => (
          <div key={idx} style={styles.message}>{msg}</div>
        ))}
      </div>
      <div style={styles.inputArea}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your prompt"
          style={styles.input}
        />
        <button onClick={handleSendMessage} style={styles.button}>Send</button>
      </div>
    </div>
  );
};

const CodeDisplayToggle = ({ onToggle, isCodeVisible }) => (
  <button onClick={onToggle} style={styles.button}>
    {isCodeVisible ? 'Show Program' : 'Show Code'}
  </button>
);

const StatusDisplay = ({ status }) => (
  <div style={styles.statusDisplay}>
    <h3>Status:</h3>
    <p>{status}</p>
  </div>
);

const CodeEditor = ({ code, onChange }) => (
  <textarea
    value={code}
    onChange={(e) => onChange(e.target.value)}
    style={{ width: '100%', height: '300px', fontFamily: 'monospace' }}
  />
);

const ProgramExecution = ({ program }) => (
  <div className="program-execution">
    <iframe srcDoc={program} style={styles.programExecution}></iframe>
  </div>
);

// Main App Component
function App() {
  const [input, setInput] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [changeInstructions, setChangeInstructions] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [githubStatus, setGithubStatus] = useState('');
  const [repositories, setRepositories] = useState([]);
  const [currentRepo, setCurrentRepo] = useState('');
  const [updateManager] = useState(() => new UpdateManager(projectStructure));
  const [isCodeVisible, setIsCodeVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [program, setProgram] = useState('');

  useEffect(() => {
    const fetchRepositories = async () => {
      const repos = await getRepositories();
      setRepositories(repos);
      if (repos.length > 0) setCurrentRepo(repos[0]);
    };
    fetchRepositories();
  }, []);

  const handleSendMessage = async (message) => {
    setIsLoading(true);
    setMessages((prevMessages) => [...prevMessages, `User: ${message}`]);
    try {
      const { generatedCode, changeInstructions } = await generateCodeAndInstructions(message, currentRepo);
      setGeneratedCode(generatedCode);
      setChangeInstructions(changeInstructions);

      updateManager.queueUpdate('generatedCode.js', generatedCode);
      updateManager.queueUpdate('changeInstructions.md', changeInstructions);
      const success = await updateManager.applyUpdates();

      if (success) {
        setGithubStatus('Changes applied successfully');
        setProgram(generatedCode);
      } else {
        setGithubStatus('Failed to apply changes. Changes rolled back.');
      }

      setMessages((prevMessages) => [...prevMessages, `AI: Code and instructions generated.`]);
    } catch (error) {
      setGithubStatus('An error occurred while processing your request.');
      setMessages((prevMessages) => [...prevMessages, `AI: Error generating code and instructions.`]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleView = () => {
    setIsCodeVisible(!isCodeVisible);
  };

  useEffect(() => {
    const sendProjectSummary = async () => {
      try {
        await axios.post('/api/projectSummary', {
          projectStructure,
          componentSummary,
          serviceSummary,
          mainFunctionality,
          technologiesUsed,
          projectDescription
        });
      } catch (error) {
        console.error('Error sending project summary:', error);
      }
    };

    sendProjectSummary();
  }, []);

  return (
    <div style={styles.app}>
      <h1 style={styles.header}>Project Texo</h1>
      <ChatWindow messages={messages} onSendMessage={handleSendMessage} />
      <CodeDisplayToggle onToggle={handleToggleView} isCodeVisible={isCodeVisible} />
      {isCodeVisible ? (
        <CodeEditor code={generatedCode} onChange={setGeneratedCode} />
      ) : (
        <ProgramExecution program={program} />
      )}
      <StatusDisplay status={githubStatus} />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
