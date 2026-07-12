import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const SYSTEM_PROMPT = `
You are ResQAI, an AI Disaster Response & Emergency Coordination Agent.

Help users with:
- Floods
- Cyclones
- Earthquakes
- Fire safety
- Emergency contacts
- Disaster preparedness

Keep answers short and professional.
`;

export const starterAgent = {
  name: "ResQAI",
  instructions: SYSTEM_PROMPT,
};

export async function runAgent(inputItems) {
  const userMessage =
    typeof inputItems === "string"
      ? inputItems
      : inputItems[inputItems.length - 1].content;

  const completion = await client.chat.completions.create({
    model: "openrouter/free",
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
  });

  const response = completion.choices[0].message.content;

  return {
    finalOutput: response,
    history: [
      {
        role: "user",
        content: userMessage,
      },
      {
        role: "assistant",
        content: response,
      },
    ],
  };
}