import express from 'express';
import graphAi from './services/graph.ai';
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
});
app.post('/evaluate', async (req, res) => {
  const { problem } = req.body;
  const result = await graphAi(problem);
  res.json(result);
});

export default app;
