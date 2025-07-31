import mongoose from "mongoose";
import Diagnosis from "../models/diagnoses.model.js";
import doneDiagnosing from "../apis/plantid.api.js";

import { dDChatCompletion } from "../apis/hf.api.js";

export const createDiagnose = async(req, res, next) =>{
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const { datetime, images, is_plant, crop, chatCompletion } = await dDChatCompletion(req.body.image)
        const contentString = chatCompletion.choices[0].message.content
        const content = JSON.parse(contentString)
        const { disease, description, remedies } = content
        // const diagnoses = await doneDiagnosing(req.body.image)
        // const {} = diagnoses[0]
        const image = images[0]

        if(!(is_plant["probability"] > 0.5 ) && !(crop["suggestions"][0]["probability"] > 0.5)){
            return res.status(401).json({ message: "Please upload a green plant"})
        }

        const existingScan = await Diagnosis.findOne({ image })

        if(existingScan){
            res.status(201).json({
            success: true,
            message: "Image scanned successfully",
            data: existingScan
        })
        }

        console.log("Creating diagnose")
        console.log(crop)
        const newScan = await Diagnosis.create([{
            user: req.body.user,
            scanDate: datetime,
            cropName: crop["suggestions"].length ? crop["suggestions"][0]["name"] : "N/A",
            image: image,
            diseases: [disease],
            remedies,
            description,

        }], { session })

        res.status(201).json({
            success: true,
            message: "Image scanned successfully",
            data: newScan
        })

        console.log("Diagnose created")

        await session.commitTransaction()

    } catch (error) {
        session.abortTransaction()
        session.endSession()
        next(error)
    }
}


export const getDiagnoses = async(req, res, next) => {
    try {
        const diagnoses = await Diagnosis.find()

        if(!diagnoses){
            res.status(200).json({
                success: true,
                message: "There is no diagnoses in the database"
            })
        }

        res.status(200).json({
            success: true,
            message: "All diagnoses",
            data: diagnoses
        })
    } catch (error) {
        next(error)
    }
}

