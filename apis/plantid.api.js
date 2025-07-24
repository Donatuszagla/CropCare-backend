// import fs from "fs/promises";
import fetch from "node-fetch";
import { API_KEY, API_URL } from "../config/env.js";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// Construct full path to image
// const imagePath = path.join(__dirname, "../config/maize.jpg");

const doneDiagnosing = async(base64Image) => {
    try {
        // const { image } = req.body.image
        // const imageBuffer = await fs.readFile();
        // console.log(`Request body: ${req.body}`)
        // const base64Image = req.body.image;

        const response = await fetch(`${API_URL}/identification`, {
        method: "POST",
        headers: {
            "Api-Key": API_KEY, 
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            images: [
               base64Image
            ],
             
        }),
        });

        const results = await response.json();
        // console.log(results)
        
        const {images, datetime} = results["input"]
        const {is_plant, disease, crop} = results["result"]

        // console.log(disease)
        // console.log(crop)
        return [{is_plant, images, datetime, disease, crop}];

    } catch (error) {
        console.error("Plant.id Error", error)
    }
}

export default doneDiagnosing;