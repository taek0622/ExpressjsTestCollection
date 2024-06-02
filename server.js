const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const webSocket = require("./socket");


const server = app.listen(port, () => {
    console.log(`Server is listening at localhost:${port}`);
});

webSocket(server);
