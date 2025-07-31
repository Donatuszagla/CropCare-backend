import { InferenceClient } from "@huggingface/inference";
import { BEARER_TOKEN } from "../config/env.js";


import doneDiagnosing from "./plantid.api.js";



const client = new InferenceClient(BEARER_TOKEN);


export const dDChatCompletion = async(image) => {

    console.log("Ai recommendation started")
    const diagnoses = await doneDiagnosing(image);
    console.log("hf.api.run");
    const disease = diagnoses?  diagnoses[0]["disease"] : "healthy";
    const is_plant = diagnoses[0]["is_plant"] 
    const crop = diagnoses[0]["crop"] 
    const datetime = diagnoses[0]["datetime"] 
    const images = diagnoses[0]["images"] 
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
    console.log("Ai recommendation ended")

    const objectToReturn = { is_plant, disease, images, crop, datetime, chatCompletion}
    return objectToReturn;
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

