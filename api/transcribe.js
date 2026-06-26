export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "GROQ_API_KEY not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Groq API connected successfully"
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
