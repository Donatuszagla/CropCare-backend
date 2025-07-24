import mongoose, { trusted } from "mongoose";

const userSchema = new mongoose.Schema({
    cropName: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    scanDate: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    diseases: {
        type: [String],
        default: []
    },
    remedies: {
        type: [String],
        default: []
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    }
}, { timestamps: true})

const diagnose = mongoose.model("Diagnose", userSchema)

export default diagnose;