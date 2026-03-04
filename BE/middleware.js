const { JWT_SECRETE } = require("./config");
const jwt = require("jsonwebtoken");


const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(403).json({
            message: "User doesn't exists"
        })
    }
    const token = authHeader.split(' ')[1];

    try{
        const decode = jwt.verify(token, JWT_SECRETE);
        //console.log(decode.userId);
        
        if(decode.userId){
            req.userId = decode.userId;
            next();
        }else return res.status(403).json({
            message: "incorrect password"
        })
    }catch(err){
        return res.status(403).json({
            message: "Error while fetching"
        })
    }

}

module.exports = {
    authMiddleware
}