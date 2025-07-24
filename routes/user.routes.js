import { Router } from "express";
import { getUsers, getUser, updateUser } from "../controllers/user.controller.js";


const userRouter = Router()


userRouter.get("/", getUsers)


userRouter.get("/:id",  getUser)


userRouter.post("/", (req, res) => {
    res.send("CREATE a user")
})

userRouter.put("/:id", updateUser)


userRouter.delete("/:id", (req, res) => {
    res.send("DELETE a user")
})

export default userRouter;