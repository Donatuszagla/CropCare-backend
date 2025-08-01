import { Router } from "express";

import { signUp, signIn, updateUser, verifyUser, resendOtp } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/sign-up", signUp)



authRouter.post("/sign-in", signIn)


authRouter.patch("/:id", updateUser)


authRouter.post("/verify", verifyUser)


authRouter.post("/resendOtp", resendOtp)
// authRouter.post("/sign-out", signOut)


export default authRouter;
