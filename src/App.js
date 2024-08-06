import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState(`作業の目的と工程:
1. プロンプトを送信してコードを生成する。
2. 生成されたコードを確認し、必要に応じて修正する。
3. 修正後のコードをGitHubにプッシュする。
4. GitHub Pagesで結果を確認する。

注意事項:
1. プロンプトを送信する前に、必要な詳細を含めることを確認する。
2. 生成されたコードを必ず確認し、正確に反映されているかチェックする。
3. コードをプッシュする前に、GitHubトークンが正しく設定されていることを確認する。
4. プッシュ後、GitHub Pagesで結果が正しく表示されているか確認する。

最新のディレクトリ構造:
project-texo-v2/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── public/
│   ├── index.html
│   ├── bundle.js
│   ├── bundle.js.LICENSE.txt
├── src/
│   ├── App.js
│   ├── server.js
│   ├── consolidatedApp.js
│   └── projectSummary.js
├── package.json
├── package-lock.json
├── webpack.config.js
├── .npmrc
├── .gitignore
└── README.md`);

  const iframeRef = useRef(null);

  const handleSubmit = async () => {
    if (!window.confirm(notes + '\n\nプロンプトを送信しますか？')) {
      return;
    }
    setStatus('Generating code...');
    try {
      const result = await axios.post('/api/generate', { prompt });
      setResponse(result.data);
      setStatus('Code generation successful.');
    } catch (error) {
      console.error('Error generating code:', error);
      await logError(error, prompt);
      setStatus(`Error generating code: ${error.response ? error.response.data : error.message}`);
      // リトライ
      if (error.response && error.response.status !== 429) {
        setStatus('Retrying code generation...');
        try {
          const result = await axios.post('/api/generate', { prompt });
          setResponse(result.data);
          setStatus('Code generation successful.');
        } catch (retryError) {
          console.error('Retry error:', retryError);
          setStatus(`Retry error: ${retryError.response ? retryError.response.data : retryError.message}`);
        }
      }
    }
  };

  const handlePushToGitHub = async () => {
    if (!window.confirm(notes + '\n\nコードをGitHubにプッシュしますか？')) {
      return;
    }
    setStatus('Pushing code to GitHub...');
    try {
      await axios.post('/api/push', { code: response });
      setStatus('Code pushed to GitHub successfully.');
      iframeRef.current.src = '/public/index.html'; // Update iframe to reflect new code
    } catch (error) {
      console.error('Error pushing code to GitHub:', error);
      await logError(error, response);
      setStatus(`Error pushing code to GitHub: ${error.response ? error.response.data : error.message}`);
      // リトライ
      if (error.response && error.response.status !== 429) {
        setStatus('Retrying code push...');
        try {
          await axios.post('/api/push', { code: response });
          setStatus('Code pushed to GitHub successfully.');
          iframeRef.current.src = '/public/index.html'; // Update iframe to reflect new code
        } catch (retryError) {
          console.error('Retry error:', retryError);
          setStatus(`Retry error: ${retryError.response ? retryError.response.data : retryError.message}`);
        }
      }
    }
  };

  const logError = async (error, context) => {
    try {
      await axios.post('/api/logError', { error: error.message, context });
    } catch (logError) {
      console.error('Error logging error:', logError);
    }
  };

  useEffect(() => {
    iframeRef.current.src = '/public/index.html';
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Project Texo</h1>
        <div>
          <textarea
            rows="10"
            cols="50"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt"
          />
          <button onClick={handleSubmit}>Send</button>
          <button onClick={() => setShowCode(!showCode)}>Show Code</button>
          <button onClick={handlePushToGitHub}>Push to GitHub</button>
        </div>
        {showCode && <pre>{response}</pre>}
        <div>Status: {status}</div>
      </header>
      <iframe ref={iframeRef} width="100%" height="600px" title="Program Viewer"></iframe>
    </div>
  );
}

export default App;
