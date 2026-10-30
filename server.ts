import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent header for AI Studio
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// In-memory cache for generated standard Malaysian Malay audio clips
const audioCache = new Map<string, string>();

// API Route for Standard Malaysian Malay TTS
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voiceKey } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Teks diperlukan' });
    }

    const cacheKey = `${voiceKey || 'clip'}_${text}`;

    // Return cached audio if available
    if (audioCache.has(cacheKey)) {
      return res.json({
        audioBase64: audioCache.get(cacheKey),
        format: 'audio/wav',
        cached: true,
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: 'Kunci API Gemini tidak dikesan pada pelayan.',
      });
    }

    // Generate Standard Malaysian Malay speech strictly according to KPM / DBP guidelines
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Gunakan Bahasa Melayu standard Malaysia (ms-MY), bukan Bahasa Indonesia.

Sebut semua perkataan dengan sebutan baku Bahasa Melayu Malaysia yang jelas dan tepat. Gunakan intonasi semula jadi, nada suara yang mesra, lembut dan ceria, serta kelajuan pertuturan yang sederhana.

Gunakan kosa kata Bahasa Melayu standard yang sesuai untuk murid sekolah rendah di Malaysia. Elakkan loghat Indonesia, kosa kata Indonesia dan gaya sebutan bahasa Indonesia.

Baca teks yang diberikan tepat seperti yang tertulis tanpa menambah atau menukar perkataan.

Teks untuk dibaca:
${text}`,
              speechMetadata: {
                style: 'Mesra, lembut, ceria, intonasi semula jadi guru Bahasa Melayu standard Malaysia ms-MY',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio =
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (base64Audio) {
      audioCache.set(cacheKey, base64Audio);
      return res.json({
        audioBase64: base64Audio,
        format: 'audio/wav',
        cached: false,
      });
    }

    return res.status(500).json({ error: 'Gagal menghasilkan audio' });
  } catch (error: any) {
    console.error('Ralat TTS Bahasa Melayu Standard:', error);
    return res.status(500).json({
      error: error?.message || 'Ralat semasa memproses sebutan Bahasa Melayu',
    });
  }
});

// Start Express server and mount Vite
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('index.html', { root: 'dist' });
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server Misi Zoo Pintar berjalan di http://localhost:${port}`);
  });
}

startServer();
