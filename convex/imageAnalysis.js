
// lib/groq/imageAnalysis.js

import {GROQ_CONFIG, SECURITY_PROMPT} from "@/lib/groq/config";

export const DEFAULT_ANALYSIS = {
    person: {
        description: "Unable to detect person in the image."
    },
    weapon: {
        name: "none",
        details: "No weapon present or unable to detect weapon in the image."
    }
};

export class ImageAnalysisService {
    validateApiKey() {
        if (!GROQ_CONFIG.API_KEY) {
            throw new Error("GROQ_API_KEY is not set in the environment variables");
        }
    }

    createPayload(base64Image) {
        return {
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: SECURITY_PROMPT
                        },
                        {
                            type: "image_url",
                            image_url: { url: `${base64Image}` }
                        },
                    ],
                }
            ],
            model: GROQ_CONFIG.MODEL,
            ...GROQ_CONFIG.DEFAULT_PARAMS
        };
    }

    async analyzeImage(base64Image) {
        try {
            this.validateApiKey();
            const payload = this.createPayload(base64Image);

            const response = await fetch(GROQ_CONFIG.API_URL, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${GROQ_CONFIG.API_KEY}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
            }

            const data = await response.json();
            const output = data.choices[0].message?.content;

            try {
                return JSON.parse(output);
            } catch (parseError) {
                console.warn("Failed to parse API output as JSON. Using default analysis.");
                return DEFAULT_ANALYSIS;
            }
        } catch (error) {
            console.error("Error analyzing image:", error);
            throw error;
        }
    }
}

export const imageAnalysisService = new ImageAnalysisService();