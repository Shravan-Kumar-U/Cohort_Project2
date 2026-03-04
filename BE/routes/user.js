const { Router } = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { User, Account } = require("../db");
const { JWT_SECRETE } = require("../config");
const { authMiddleware } = require("../middleware");
const userRouter = Router();

const signupSchema = zod.object({
    email: zod.string().email(),
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

    // Generating a random amount for the user from 1 to 1000
    await Account.create({
        userId: dbUser._id,
        balance: parseFloat((1 + Math.random() * 1000).toFixed(2))
    })

    const token = jwt.sign({
        userId: dbUser._id
    }, JWT_SECRETE)

    res.status(200).json({
        message: "Signup success fully",
        token: token
    })
})

userRouter.post("/signin", async (req, res) => {
    const { success } = signupSchema.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message: "Emaily is already taken try new things"
        })
    }

    const user = await User.findOne({
        email: req.body.email,
        password: req.body.password
    })

    if(user){
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRETE)

        res.json({
            token: token
        })
        return;
    }

    return res.json({
        message: "Error while loginin in"
    })
})


const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional()
})


userRouter.put("/update", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message: "Emaily is already taken try new things"
        })
    }

    await User.updateOne(
        {
            _id: req.userId
        }, {
            $set: req.body
        })

    res.json({
        message: "Updated Succefully"
    })
})

//select * from user where ename is like = '%shra%'
// Similarly if i want to do this operation in MongoDB then follow the below syntax

userRouter.get("/bulk", async(req, res) => {
    const filter = req.query.filter || '';
    
    const users = await User.find({
        $or:[{
                firstName: {
                    "$regex": filter
                }
            },{
                lastName: {
                    "$regex": filter
                }
            }
        ]
    }) 

    res.json({
        user: users.map(user => ({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
        }))
    })
})

module.exports = {
    userRouter
}