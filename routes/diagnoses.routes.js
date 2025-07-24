import { Router } from "express";
import { createDiagnose, getDiagnoses } from "../controllers/diagnoses.controller.js";

const diagnosesRouter = Router();

diagnosesRouter.post("/", createDiagnose)

diagnosesRouter.get("/", getDiagnoses)

// diagnosesRouter.get("/:id", getDiagnose)

export default diagnosesRouter;