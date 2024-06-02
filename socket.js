const WebSocket = require("ws");

module.exports = (server) => {
    const wss = new WebSocket.Server({ server, path: "/chat" });
    wss.on("connection", (ws, req) => {
        const ip = req.headers["x-forward-for"] || req.connection.remoteAddress;
        console.log("새로운 클라이언트 접속", ip);
        ws.on("message", (message) => {
            console.log(JSON.parse(message));
        });
        ws.on("error", (error) => {
            console.log(error);
        });
        ws.on("close", () => {
            console.log("클라이언트 접속 해제", ip);
            clearInterval(ws.interval);
        });
        ws.interval = setInterval(() => {
            if (ws.readyState == ws.OPEN) {
                ws.send("서버에서 클라이언트로 메시지를 보냅니다");
            }
        }, 3000);
    });
};
