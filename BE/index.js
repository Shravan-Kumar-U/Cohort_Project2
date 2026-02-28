const express = require("express");
const cors = require("cors");
const { router } = require("./routes");
app.use(cors());
const app = express();

const PORT = 3000;
app.use(express.json());



app.use("/api/v1/user", router);

app.listen(PORT, () => {
    console.log(`Listening to the port ${PORT}`);
    
})