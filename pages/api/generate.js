import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { type, prompt } = req.body;

  // Document-specific system prompts to ensure HTML output
  const systemByType = {
    cv: "You are a professional resume writer. Generate a modern, ATS-friendly CV in **clean HTML** with sections: Header (name/contact), Summary, Skills, Experience, Education.",
    invoice:
      "You are an invoice generator. Return a professional **HTML invoice** with company name, bill-to, date, table of items (description, qty, price, total), subtotal, tax, and grand total.",
    cover_letter:
      "You are a career coach. Return a well-formatted **HTML cover letter** inside <div> tags with polite greeting, 2-3 short paragraphs, and signature.",
  };

  const systemPrompt =
    systemByType[type] || "You are a document generator. Return clean HTML.";

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      max_tokens: 700,
    });

    const html = response.choices[0].message.content;
    return res.status(200).json({ text: html });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to generate" });
  }
}
