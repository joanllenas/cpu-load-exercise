import express from 'express';
import os from 'os';
import cors from 'cors';

const app = express();
app.use(cors());

const PORT = 3001;

app.get('/api/load-average', (req, res) => {
  const cpus = os.cpus().length;
  const loadAverage = os.loadavg()[0] / cpus;
  res.json({ result: loadAverage });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
