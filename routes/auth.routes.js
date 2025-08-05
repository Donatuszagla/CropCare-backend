import { Router } from "express";

import { signUp, signIn, updateUser, verifyUser, resendOtp, deleteUser } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/sign-up", signUp)



authRouter.post("/sign-in", signIn)


authRouter.patch("/:id", updateUser)


authRouter.post("/verify", verifyUser)


authRouter.post("/resendOtp", resendOtp)

authRouter.delete("/:id", deleteUser)


export default authRouter;
