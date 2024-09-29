import OpenAI from "openai";
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function invokeOpenAI(text: string) {
    const result_prompt = 'Używając podanego niżej tekstu w języku Polskim dokonaj ocene następnych parameterów:\n' +
        'a) przerywniki\n' +
        'c) powtórzenia\n' +
        'd) zmiana tematu wypowiedzi\n' +
        'e) za dużo liczb\n' +
        'f) za długie, trudne słowa, zdania\n' +
        'g) żargon\n' +
        'h) obcy język\n' +
        'o) nieprawdziwe słowa\n' +
        'r) używanie strony biernej np. podano, wskazano, podsumowano.\n' +
        'Dodatkowo:\n' +
        '- podsumuj krótko treść tekstu\n' +
        '- dokonaj oceny zrozumiałości przekazu\n' +
        '- określ sentyment wypowiedzi (emocje, ton wypowiedzi, hate speech)\n' +
        '- ocen grupę docelową analizowanego nagrania ze względu na grupę wiekową lub\n' +
        'wyksztalcenie \n' +
        '\n' +
        'Wynik podaj proszę w języku polskim.\n' +
        '\n' +
        'Tekst: ' + text
    const response = await openai.chat.completions.create({
        messages: [{ role: 'user', content: result_prompt }],
        model: 'gpt-3.5-turbo'
    }).asResponse();

    return response.data.choices[0].text;
}

// Example usage
// don't forget to install openai via npm: 'npm install openai'

// generateText('Transcripted text')
//     .then((text: string) => console.log(text))
//     .catch((error: any) => console.error(error));