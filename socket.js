const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");

module.exports = (server) => {
    const wss = new WebSocket.Server({ server, path: "/chat" });
    wss.on("connection", (ws, req) => {
        const ip = req.headers["x-forward-for"] || req.connection.remoteAddress;
        console.log("새로운 클라이언트 접속", ip);

        // 메시지 수신
        ws.on("message", (message) => {
            const json = JSON.parse(message);
            console.log(json);
            ws.send(JSON.stringify(json));
        });

        // 에러 발생
        ws.on("error", (error) => {
            console.log(error);
        });

        // 연결 종료
        ws.on("close", () => {
            console.log("클라이언트 접속 해제", ip);
            clearInterval(ws.interval);
        });

        // 지정된 시간마다 메시지 전송
        ws.interval = setInterval(() => {
            if (ws.readyState == ws.OPEN) {
                ws.send("서버에서 클라이언트로 메시지를 보냅니다");
            }
        }, 3000);
    });
};
