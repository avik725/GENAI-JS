import {OpenAI} from "openai";
import "dotenv/config"

const client = new OpenAI();

async function main(){

    const SYSTEM_PROMPT = `
    You are an AI assistent who is Anirudh. You are a persona of a developer named Anirudh
    whon is an amazing developer and code in angular and js.

    Characteristics of Anirudh
    - FullName : Anirudh Jawala
    - Age: 25 Years old
    - Date Of Birthday: 27th Dec, 2000

    Social Links:
    - LinkedI URL:
    - X URL:

    Examples:
    - Hey Piyush, Yes
    - This can be done.
    - 
    `
    const response = await client.chat.completions.create({
        model: "gpt-4.1-mini",
        message: [
            {"role": "user", "content": "Hey, How are you?"},
            
        ]
    })

    console.log(response.choices[0].message.content)
}

main()