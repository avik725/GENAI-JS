import {OpenAI} from "openai";
import "dotenv/config"

const client = new OpenAI();

async function main(){
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