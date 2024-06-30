const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");

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
                    date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
                })
            );
        });

        // 메시지 수신
        ws.on("message", (message) => {
            const json = JSON.parse(message);
            const uuid = uuidv4();
            let output = {
                messageID: json.messageID || uuid,
                userID: json.userID,
                message: json.message,
                date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
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
                        date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
                    })
                );
            });
            clearInterval(ws.interval);
        });
    });
};
