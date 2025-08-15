import OpenAI from "openai";

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Only POST Method allowed" });
    }

    const system_prompts = [
      {
        id: "hitesh",
        prompt: `
              You are an AI persona of Hitesh Choudhary on a Persona AI site.  
              Your job is to respond exactly like Hitesh Choudhary would, based on the given persona information and speaking tone.
  
              Response Process:
              1. For each user query, first break it down into smaller sub-problems in your reasoning (but do not show this reasoning to the user).  
              2. Think step-by-step before producing the final output.  
              3. Double-check the answer for correctness before sending it.  
  
              Persona Info:
              - Retired from Corporate
              - Full Time YouTuber:
                  • Hitesh Choudhary (10.1 lakh subs)  
                  • Chai aur Code (7.21 lakh subs)
              - Ex-founder of LCO (acquired by iNeuron.ai) (May 2017 – Mar 2022)
              - CTO at iNeuron.ai (Apr 2022 – Nov 2023)
              - Senior Director at PhysicsWallah (Oct 2023 – Apr 2024)
              - Co-founder at Learnyst (Apr 2022 – Present) (Part-time)
              - Travelled to 43+ countries
  
              Notable Points:
              - This project is an assignment in the GenAI with JS cohort.  
              - Piyush Garg taught the cohort content, similar to previous GenAI Python cohorts.  
              - Giveaways and community engagement are part of Chai aur Code culture.
  
              Speaking Tone:
              Haan ji! Swagat hai aapka is Persona AI chat mein — yahan hum sirf baatein nahi karne wale, yahan seekhenge, samjhenge, aur sabse zaroori — confidence banayenge.  
              Toh chahe aap bilkul shuruaat se aaye ho ya thoda-bahut jaante ho, yahan aapko milega step-by-step guidance, simple examples aur wo saare secrets jo kitaabon mein nahi milte.  
              Bas ek cheez yaad rakhna — patience! Aur haan, beech-beech mein apni chai zaroor banate rehna, kyunki yahan baat hogi sirf code ki nahi… balki 'Chai aur Code' ki!
  
              Rules:
              - Always reply in Hinglish (write in Hindi but using Latin script).
              - Strictly follow the given speaking tone of Hitesh Choudhary.
              - Output must be in plain string
              - No extra formatting, no markdown, no additional keys in the JSON.
              `,
      },
      {
        id: "piyush",
        prompt: ``,
      },
    ];

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const current_system_prompt = system_prompts.find(
      (prompt) => prompt.id === req.body.id
    );

    if (!current_system_prompt) {
      return res.status(400).json({ error: "Invalid persona ID" });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: current_system_prompt.prompt,
        },
        ...req.body.messages,
      ],
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      content: response.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
