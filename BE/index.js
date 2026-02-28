const express = require("express");

const app = express();

const PORT = 3000;

app.post("/signup", (req, res) => {

})

app.listen(PORT, () => {
    console.log(`Listening to the port ${PORT}`);
    
})