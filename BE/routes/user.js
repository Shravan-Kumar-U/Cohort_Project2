const { Router } = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { User } = require("../db");
const { JWT_SECRETE } = require("../config");
const userRouter = Router();

const signupSchema = zod.object({
    emial: zod.string().email(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
})

userRouter.post("/signup", async (req, res, next) => {
    const body = req.body;
    const { success } = signupSchema.safeParse(req.body);
    if(!success){
        res.status(403).json({
            message: "Incorrect Input"
        })
        return;
    }
    const user = User.findOne({
        email: body.email
    })

    if(user._id){
        res.status(403).json({
            message: "User already Exisits"
        })
        return;
    }

    const dbUser = await User.create(body);

    const token = jwt.sign({
        userId: dbUser._id
    }, JWT_SECRETE)

    res.status(200).json({
        message: "Signup success fully",
        token: token
    })
})

module.exports = {
    userRouter
}