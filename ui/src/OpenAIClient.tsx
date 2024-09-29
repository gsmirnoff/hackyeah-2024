import OpenAI from "openai";
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function invokeOpenAI(prompt: string) {
    const response = await openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-3.5-turbo'
    }).asResponse();

    return response.data.choices[0].text;
}

// Example usage
// don't forget to install openai via npm: 'npm install openai'

// generateText('Translate the following English text to French: "{Hello, world!}"')
//     .then((text: string) => console.log(text))
//     .catch((error: any) => console.error(error));