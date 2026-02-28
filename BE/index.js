const express = require("express");
const { userRouter } = require("./routes/user");

const app = express();

const PORT = 3000;
app.use(express.json());



app.use("/api/v1/user", userRouter);

app.listen(PORT, () => {
    console.log(`Listening to the port ${PORT}`);
    
})