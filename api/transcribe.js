export const config = {
  api: {
    bodyParser: false,
  },
};

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "GROQ_API_KEY not found" });
    }

    const contentType = req.headers["content-type"];

    if (!contentType || !contentType.includes("multipart/form-data")) {
      return res.status(400).json({ error: "Please upload an audio or video file." });
    }

    const bodyBuffer = await readBody(req);

    const groqResponse = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": contentType,
      },
      body: bodyBuffer,
    });

    const data = await groqResponse.json();

    if (!groqResponse.ok) {
      return res.status(groqResponse.status).json({
        error: data.error?.message || "Transcription failed",
        details: data,
      });
    }

    return res.status(200).json({
      success: true,
      transcript: data.text || "",
      raw: data,
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}
