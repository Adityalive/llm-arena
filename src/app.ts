import express from 'express';
import graphAi from './services/graph.ai';
const app = express();
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hello World');
});
app.post('/evaluate', async (req, res) => {
  const { problem } = req.body;
  if (typeof problem !== 'string' || !problem.trim()) {
    res.status(400).json({ error: 'problem is required and must be a non-empty string' });
    return;
  }
  const result = await graphAi(problem);
  res.json(result);
});

export default app;
