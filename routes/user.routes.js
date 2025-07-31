import { Router } from "express";
import { getUsers, getUser } from "../controllers/user.controller.js";


const userRouter = Router()


userRouter.get("/", getUsers)


userRouter.get("/:id",  getUser)


userRouter.post("/", (req, res) => {
    res.send("CREATE a user")
})



userRouter.delete("/:id", (req, res) => {
    res.send("DELETE a user")
})

export default userRouter;