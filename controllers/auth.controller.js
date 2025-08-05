import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";
import otpgenerator from "otp-generator";
import nodemailer from "nodemailer";


export const signUp = async(req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, email, password } = req.body;

        // Check if a user already exists
        const existingUser = await User.findOne({ email });
        

        if(existingUser){
            const error = new Error("User already exist");
            error.statusCode = 409;
            throw error;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // const otpGenerator = require('otp-generator');

        // Generate a 6-digit numeric OTP
        const otp = otpgenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
        });


        const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'cropcare165@gmail.com',
            pass: 'pbzsaqflgmldrrry',
        },
        });

        const mailOptions = {
        from: 'cropcare165@gmail.com',
        to: email,
        subject: 'Your CropCare verification Code.',
        text: `Your OTP code is: \n ${otp} \n  Please ignore this if you did not initiate it`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Email sent:', info.response);
        });


        const newUsers = await User.create([{name, email, password: hashedPassword, otp: JSON.stringify(otp), verified: false, optExpires: Date.now() + 15 * 60 * 1000 }], { session })
        
        const token = jwt.sign({ userId: newUsers[0]._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN})
    
        const {password: _, ...userToReturn} = newUsers[0].toObject()

        res.status(201).json({
            success: true,
            message: "User created successfully",
            token,
            user: userToReturn
        })
        await session.commitTransaction()
    } catch (error) {
        session.abortTransaction();
        session.endSession;
        next(error)

    }


}

export const signIn = async(req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({email})

    if(!user){
        const error = new Error("User not found");
        error.stackCode = 404;
        throw error
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid){
        const error = new Error("Invalid password");
        error.stackCode = 401;
        throw error
    }

    const token = jwt.sign({userId: user._id }, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN})

    const {password: _, ...userToReturn} = user.toObject()
    res.status(200).json({
        success: true,
        message: "User sign in successfully",
        data: {
            token,
            user: userToReturn,
        }
    })
}

export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const { name, password } = req.body;

    if (name) user.name = name;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.save();
    const { password: _, ...userWithoutPassword } = updatedUser.toObject();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};



export const verifyUser = async(req, res, next) => {
  try {
    const { email, enteredOtp } = req.body;
    
    const existingUser = await User.findOne({ email })

    if(!existingUser){
        return res.status(404).json({ success: false, message: "User Not Found"})
    }
    
    // let otpStore = {}; // key: email/phone, value: { otp, expiresAt }

    // otpStore[email] = {
    // otp: otp,
    // expiresAt: Date.now() + 5 * 60 * 1000 // expires in 5 minutes
    // };
    if(existingUser.optExpires < Date.now()){
        return res.status(400).json({success: false, message: "OTP has expired"})
    }
    
    
    
    const record = existingUser.otp === JSON.stringify(enteredOtp);
    console.log(enteredOtp)
    console.log(existingUser.otp)

    if (!record) {
        return res.status(400).json({success: false, message: 'Invalid OTP.'});
    }

    // if (Date.now() > record.expiresAt) {
    //     return res.status(400).send('OTP expired.');
    // }

    // if (existingUser.otp !== enteredOtp) {
    //     return res.status(400).send({success: false, message: 'Invalid OTP.'});
    // }

    // Verified
    existingUser.optExpires = ""; // Clear after use
    existingUser.otp = ""; // Clear after use
    existingUser.verified = true; // Clear after use
    await existingUser.save()
    res.status(200).json({success: true, message: 'OTP verified successfully!'});

  } catch (error) {
    next(error)
  }
}

export const resendOtp = async(req, res, next) => {
  try {

    const { email } = req.body
    const user = await User.findOne({ email })

    if(!user){
      return res.status(404).json({success: false, message: "User Not Found"})
    }
    // Generate a 6-digit numeric OTP
        const otp = otpgenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
        });


        const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'cropcare165@gmail.com',
            pass: 'pbzsaqflgmldrrry',
        },
        });

        const mailOptions = {
        from: 'cropcare165@gmail.com',
        to: email,
        subject: 'Your CropCare verification Code.',
        text: `Your OTP code is: \n ${otp} \n  Please ignore this if you did not initiate it`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Email sent:', info.response);
        });
    user.otp = JSON.stringify(otp)
    user.optExpires = Date.now() + 15 * 60 * 1000
    await user.save()
    res.status(200).json({success: true, message: `OTP sent to ${email}`, id: user._id})
    
  } catch (error) {
    next(error)
  }
}


export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};