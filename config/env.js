import { config } from "dotenv";


config({path: `.env.${process.env.NODE_ENV || "development"}.local`})

export const { 
    PORT, NODE_ENV, 
    DB_URI,
    JWT_SECRET, JWT_EXPIRES_IN,
    API_URL, API_KEY,
    BEARER_TOKEN,
} = process.env;