import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true, "User Name is required"],
        trim: true,
        minLength: 3,
        maxLength: 50,
    },
    email: {
        type: String, 
        required: [true, "User Email is required"],
        trim: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please fill a valid email address"]
    },
    password: {
        type: String, 
        required: [true, "User Password is required"],
        minLength: 6,
    },
    verified: {
        type: Boolean,
        required: true,
        default: false,
    },
    otp: {
        type: String,
        length: 6
    },
    optExpires: {
        type: Number
    }
}, { timestamps: true})

const user = mongoose.model("User", userSchema)

export default user;