import { InferenceClient } from "@huggingface/inference";
import { BEARER_TOKEN } from "../config/env.js";


import doneDiagnosing from "./plantid.api.js";



const client = new InferenceClient(BEARER_TOKEN);


export const dDChatCompletion = async(image) => {

    const diagnoses = await doneDiagnosing(image);
    console.log("hf.api.run");
    const disease = diagnoses?  diagnoses[0]["disease"] : "healthy";
    // console.log(disease)
    // const chatCompletion = await client.chatCompletion(


    //     {
    //         model: "mistralai/Magistral-Small-2506",
    //         messages: [
    //             {
    //                 role: "system",
    //                 content: `You are CropCare AI, an intelligent assistant created to help farmers diagnose crop diseases and provide actionable remedies. Always stay relevant to agriculture, plant diseases, remedies, and farming tips. If the user asks something unrelated, politely guide them back to crop-related questions. Answer concisely and clearly.
    //                 {
    //                     "disease": "string",
    //                     "description": "string",
    //                     "symptoms": ["string", ...],
    //                     "remedies": ["string", ...]
    //                 }
    //                 Never include extra text or commentary outside the JSON object.`
    //             },
    //             {role: "user", content: `${disease["suggestions"][0]["name"]}`}
    //         ],
    // });
    // return chatCompletion;
    const chatCompletion = await client.chatCompletion({
    model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
    messages: [
        {
        role: "system",
        content: `You are CropCare AI, an intelligent assistant created to help farmers diagnose crop diseases and provide actionable remedies. Always respond in the following JSON format without any explanation or extra text:
    {
    "disease": "string",
    "description": "string",
    "symptoms": ["string"],
    "remedies": ["string"]
    }

    Stay relevant to agriculture, plant diseases, remedies, and farming tips. If the user asks something unrelated, politely guide them back to crop-related questions.`,
        },
        {
        role: "user",
        content: `${disease["suggestions"][0]["name"]}`, // e.g., "Cassava Mosaic Disease"
        },
    ],
    });

    return chatCompletion;
}



export const userAiChatCompletion = async(req, res) => {
    const chatCompletion = await client.chatCompletion(
    {
        model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
        messages: [
            {
                role: "system",
                content: `You are CropCare AI, an intelligent assistant created to help farmers diagnose crop diseases and provide actionable remedies. Always stay relevant to agriculture, plant diseases, remedies, and farming tips. If the user asks something unrelated, politely guide them back to crop-related questions. Answer concisely and clearly.`
            },
            {role: "user", content: `${req.body.userInput}`}
        ],
    });
    res.status(200).json({
        success: true,
        response: chatCompletion.choices[0].message.content
    })
}

