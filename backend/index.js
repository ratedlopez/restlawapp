import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'No message provided' });
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant for restaurant legal and compliance questions. Always tailor your answers to the user\'s state if mentioned.' },
        { role: 'user', content: message }
      ],
      max_tokens: 512
    });
    const answer = completion.choices[0]?.message?.content || 'Sorry, no answer.';
    res.json({ answer });
  } catch (e) {
    res.status(500).json({ error: 'OpenAI error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
}); 