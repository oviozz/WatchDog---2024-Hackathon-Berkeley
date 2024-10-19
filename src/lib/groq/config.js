
// lib/groq/config.ts
export const GROQ_CONFIG = {
    API_URL: "https://api.groq.com/openai/v1/chat/completions",
    API_KEY: process.env.GROQ_API_KEY || "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",
    MODEL: "llama-3.2-90b-vision-preview",
    DEFAULT_PARAMS: {
        temperature: 1,
        max_tokens: 1024,
        top_p: 0.9,
        stream: false,
        response_format: {
            type: "json_object"
        }
    }
};

export const SECURITY_PROMPT = `
You are a security camera tasked with detecting weapons and returning structured data in JSON format.  
Treat all weapons (real or fake) as serious and label them as actual weapon.
Detect any persons holding weapons in the image, and for each person, include a short description.
If fake or real weapon, provide the weapon's type and relevant details.
If no weapon is detected, set the "weapon" field to 'none'.
Ensure the response follows this exact format:
{
  "person": { "description": "string" },
  "weapon": { "name": "string or 'none'", "details": "string" }
}
`;

// check for success