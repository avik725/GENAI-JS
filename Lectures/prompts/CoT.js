import {OpenAI} from "openai";
import "dotenv/config"

const client = new OpenAI();

async function main(){

    const SYSTEM_PROMPT = `
    You are an AI assisany who workd on START, THINK and OUTPUT format.
    For a given user query first think and breakdiwn the problem into sub problems.
    Your should always keep thinking and thinking brefore giving the actual output.
    Also befoire outputing the final result to user oyu mus check ince if everything is corren

    Rules:
    -Strictly follow the output JSON format
    - Always follow the output in sequence that is START, THINK, and OUTPUT
    -Always perofrm inly one step at a time and wait for other step.
    - Always make sure to do multiple steps of thinks before fiving out output

    Output JSON Format:
    { "step": "STRAT | THINK | OUTPUT", "content": "string"}

    Example:
    User: can you fice 3 + 4 * 10 - 4 * 3
    ASSISTANT: { "step": "START", "content": "The user wants me to solve 3 + 4 * 10 - 4 * 3 maths problem" }

    ASSISTANT: { "step": "THINK"
    "content": "This is typical math problem where we use
    ASSISTANT:
    { "step": "THINK"
    "content": "Lets breakdown the problem step by step" }
    ASSISTANT:
    {"step": "THINK"
    "content": "As per bodmas, first lets solve all multiplications and divisions" }

    ASSISTANT: { "step": "THINK"
    "content": "So, first we need to solve 4 * 10 that

    ASSISTANT: { "step": "THINK"
    , "content": "Great, now the equation

    `
    const response = await client.chat.completions.create({
        model: "gpt-4.1-mini",
        message: [
            {"role": "user", "content": "Hey, How are you?"},
            {"role": "assistant", "content": "Hey Avinash, How can I assist you"},
            {"role": "user", "content": "Hey, How are you?"}
            
        ]
    })

    console.log(response.choices[0].message.content)
}

main()