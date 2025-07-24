import { CohereClient } from 'cohere-ai';

const cohere = new CohereClient({
    apiKey: process.env.CO_API_KEY
});

export async function analyzeResume(resumeText, job) {
    // Fix: Better text truncation
    const MAX_LENGTH = 10000;
    const truncatedText = resumeText.length > MAX_LENGTH
        ? resumeText.substring(0, MAX_LENGTH) + "... [TRUNCATED]"
        : resumeText;

    const prompt = `
### Job Position ###
${job.title}

### Key Requirements ###
${job.requirements.join('\n')}

### Candidate's Resume ###
${truncatedText}

### Analysis Task ###
Evaluate candidate suitability based on:    
1. Skills relevance (0-10)
2. Experience match (0-10)
3. Project quality (0-10)
4. Education background (0-10)
5. Overall recommendation (Strong/Medium/Weak)

### Output Format ###
{JSON ONLY}
{
  "skills": { "score": number, "reason": "brief explanation" },
  "experience": { "score": number, "reason": "brief explanation" },
  "projects": { "score": number, "reason": "brief explanation" },
  "education": { "score": number, "reason": "brief explanation" },
  "overall": { "score": number, "recommendation": "string" }
}
`;

    try {
        const response = await cohere.generate({
            model: 'command',
            prompt,
            max_tokens: 1000,
            temperature: 0.3,
        });

        // Robust JSON extraction
        const jsonString = response.generations[0].text
            .replace(/```json|```/g, '')
            .replace(/(\w+):/g, '"$1":')  // Fix unquoted keys
            .trim();

        try {
            return JSON.parse(jsonString);
        } catch (parseError) {
            console.error('JSON Parse Error:', jsonString);
            return {
                error: "AI response format invalid"
            };
        }
    } catch (error) {
        console.error('AI Analysis Error:', error);
        return {
            error: "Resume analysis failed"
        };
    }
}
