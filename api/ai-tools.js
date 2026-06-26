export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { transcript } = req.body;

    if (!transcript) {
      return res.status(400).json({
        error: "Transcript is required"
      });
    }

    const words = transcript.trim().split(/\s+/).length;

    let language = "English";

    const myanmarRegex = /[\u1000-\u109F]/;

    if (myanmarRegex.test(transcript)) {
      language = "Myanmar";
    }

    let summary = transcript;

    if (transcript.length > 300) {
      summary = transcript.substring(0, 300) + "...";
    }

    return res.status(200).json({
      success: true,
      language,
      words,
      characters: transcript.length,
      summary
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
