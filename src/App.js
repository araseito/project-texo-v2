import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState(`作業の目的と工程:
1. プロンプトを送信してテトリスゲームのコードを生成する。
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
      setStatus('Error generating code.');
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
    } catch (error) {
      console.error('Error pushing code to GitHub:', error);
      setStatus('Error pushing code to GitHub.');
    }
  };

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
    </div>
  );
}

export default App;
