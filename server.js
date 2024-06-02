const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const webSocket = require("./socket");

app.use((req, res, next) => {
    next();
    console.log(`A '${req.method}' request was received from '${req.url}'`);
});

app.get("/", (req, res, next) => {
    res.json({
        success: true,
    });
});

const server = app.listen(port, () => {
    console.log(`Server is listening at localhost:${port}`);
});

webSocket(server);
