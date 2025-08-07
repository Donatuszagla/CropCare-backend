import { Router } from "express";
import { createDiagnose, getDiagnoses, deleteDiagnose } from "../controllers/diagnoses.controller.js";

const diagnosesRouter = Router();

diagnosesRouter.post("/", createDiagnose)

diagnosesRouter.get("/", getDiagnoses)

diagnosesRouter.delete("/:id", deleteDiagnose)

// diagnosesRouter.get("/:id", getDiagnose)

export default diagnosesRouter;