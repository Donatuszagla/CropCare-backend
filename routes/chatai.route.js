import { Router } from "express";
import { userAiChatCompletion } from "../apis/hf.api.js";

const aiRouter = Router();

aiRouter.post("/", userAiChatCompletion)


// aiRouter.get("/:id", getDiagnose)

export default aiRouter;