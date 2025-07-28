import express from "express";
import { PORT } from "./config/env.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import diagnosesRouter from "./routes/diagnoses.routes.js";
import aiRouter from "./routes/chatai.route.js";
import connectToDatabase from "./database/mongodb.js";
import errorHandler from "./middleWares/errorHandler.js";

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({extended: true, limit: "50mb"}))



app.use("/api/CropCare/auth", authRouter);
app.use("/api/CropCare/users", userRouter);
app.use("/api/CropCare/diagnoses", diagnosesRouter);
app.use("/api/CropCare/ai", aiRouter);





app.get("/", (req, res) => {
    res.send("Welcome to CropCare API")
})


app.listen(PORT, async(req, res) => {
    console.log(`Server running at port ${PORT}`);

    await connectToDatabase();
})

// app.all('*', (req, res, next) => {
//   const err = new Error(`Can't find ${req.originalUrl} on this server!`);
//   err.statusCode = 404;
//   next(err);
// });
app.use(errorHandler);
export default app;