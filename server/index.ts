import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { scanRouter } from './scanRoute.js';

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json());

app.use('/api', scanRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'empowher-api' });
});

app.listen(PORT, () => {
  console.log(`EmpowHER API listening on http://localhost:${PORT}`);
});
