const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { exec } = require('child_process');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
      prompt: prompt,
      max_tokens: 2000,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    });
    res.send(response.data.choices[0].text);
  } catch (error) {
    console.error('Error generating code:', error);
    res.status(500).send('Error generating code.');
  }
});

app.post('/api/push', (req, res) => {
  const { code } = req.body;
  exec(`git pull origin main && git add . && git commit -m "Add generated code" && git push https://x-access-token:${process.env.GH_PAT}@github.com/username/repo.git main`, (error, stdout, stderr) => {
    if (error) {
      console.error('Error pushing code to GitHub:', error);
      res.status(500).send('Error pushing code to GitHub.');
      return;
    }
    res.send('Code pushed to GitHub successfully.');
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
