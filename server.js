const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `Du bist der freundliche Assistent von EDO Personal Training in Deutschland.

EDO Personal Training bietet an:
- Kickboxen für Anfänger und Fortgeschrittene
- Powerfitness
- Funktionelles Training
- Cross Fitness
- Personal Training

Deine Aufgaben:
- Beantworte Fragen zu Kursen, Trainingsarten und Angeboten
- Motiviere Interessenten zum Probetraining
- Verweise bei Fragen zu Preisen und Terminen auf eine direkte Kontaktaufnahme
- Bleibe immer freundlich, sportlich und motivierend

Du antwortest ausschließlich auf Deutsch.
Du beantwortest nur Fragen die mit EDO Personal Training oder Sport zu tun haben.
Bei allen anderen Themen sagst du höflich dass du dafür nicht zuständig bist.`;

app.post('/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Keine Nachricht erhalten' });
  }

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: message }
      ],
    });

    const reply = response.content[0].text;
    res.json({ reply });

  } catch (error) {
    console.error('API Fehler:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Antwort' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`EDO Bot läuft auf Port ${PORT}`);
});
