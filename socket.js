const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");

module.exports = (server) => {
    const wss = new WebSocket.Server({ server, path: "/chat" });
    wss.on("connection", (ws, req) => {
        const ip = req.headers["x-forward-for"] || req.connection.remoteAddress;
        console.log("새로운 클라이언트 접속", ip);
        const uuid = uuidv4();

        wss.clients.forEach((client) => {
            client.send(
                JSON.stringify({
                    messageID: uuid,
                    userID: "SystemMessage",
                    message: "새로운 유저가 접속했습니다.",
                    date: "2024-11-01",
                })
            );
        });

        // 메시지 수신
        ws.on("message", (message) => {
            const json = JSON.parse(message);
            const uuid = uuidv4();
            let output = {
                messageID: uuid,
                userID: json.userID,
                message: json.message,
                date: json.date,
            };
            console.log(output);

            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(output));
                }
            });
        });

        // 에러 발생
        ws.on("error", (error) => {
            console.log(error);
        });

        // 연결 종료
        ws.on("close", () => {
            console.log("클라이언트 접속 해제", ip);
            const uuid = uuidv4();
            wss.clients.forEach((client) => {
                client.send(
                    JSON.stringify({
                        messageID: uuid,
                        userID: "SystemMessage",
                        message: "상대 유저가 접속을 해제했습니다.",
                        date: "2024-11-01",
                    })
                );
            });
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
