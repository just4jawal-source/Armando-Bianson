import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI on the server side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// System instructions tailored for Armando Bianson's creative studio & AI direction
const DEFAULT_SYSTEM_INSTRUCTION = `You are "Aura", the AI Creative Producer & Assistant for Armando Bianson's portfolio.
Armando is a premier UGC Creator, AI Video Director, and Commercial Ad Specialist.
His expertise covers:
- High-converting TikTok & Instagram Reels video ads (3-second hook optimization, UGC testimonials, aesthetic pacing).
- AI Cinematics, Veo-style generated B-roll, product morphs, and generative advertising visuals.
- Full-funnel creative strategy (scriptwriting, creative concepts, batch ad production, iteration based on ROAS/CTR).
- Creative tools: Midjourney, Runway Gen-3, Luma Dream Machine, Google Veo, CapCut Pro, DaVinci Resolve, ElevenLabs, Premiere Pro.

Your role:
1. Greet visitors warmly and professionally.
2. Help prospective brand clients, agency creative directors, and founders explore Armando's past work, creative packages, and production workflows.
3. Answer questions about deliverables, project turnaround times (typically 3-5 business days for UGC packs), licensing, and creative direction.
4. If a client wants to book or get a custom quote, invite them to use the "Contact" section below or provide details for a direct project inquiry.
5. Provide actionable creative advice on UGC hooks and AI video concepts if asked.
6. Keep answers concise, inspiring, formatted with clean bullet points or short paragraphs when appropriate.`;

// Multi-turn chat API route with role and model selection support
app.post('/api/chat', async (req, res) => {
  try {
    const {
      messages = [],
      model = 'gemini-3.5-flash',
      systemInstruction = DEFAULT_SYSTEM_INSTRUCTION,
    } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    // Model selection rules:
    // - Complex tasks: 'gemini-3.1-pro-preview'
    // - Fast tasks: 'gemini-3.1-flash-lite'
    // - General tasks: 'gemini-3.5-flash'
    let selectedModel = model;
    if (
      selectedModel !== 'gemini-3.1-pro-preview' &&
      selectedModel !== 'gemini-3.1-flash-lite' &&
      selectedModel !== 'gemini-3.5-flash'
    ) {
      selectedModel = 'gemini-3.5-flash';
    }

    // Convert multi-turn history into contents expected by Gemini SDK
    // The last message is the current user prompt, previous ones are the conversation history
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'I apologize, but I could not formulate a response at this moment.';
    return res.json({ reply, model: selectedModel });
  } catch (error: any) {
    console.error('Gemini Chat Error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate response from Gemini.',
    });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
