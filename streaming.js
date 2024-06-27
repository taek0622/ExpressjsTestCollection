const NodeMediaServer = require("node-media-server");

const config = {
    rtmp: {
        port: 1935,
        chunk_size: 60000,
        gop_cache: true,
        ping: 30,
        ping_timeout: 60,
    },
    http: {
        port: 8000,
        allow_origin: "*",
        mediaroot: "./media",
    },
    trans: {
        ffmpeg: "/opt/homebrew/bin/ffmpeg",
        tasks: [
            {
                app: "live",
                hls: true,
                hlsFlags:
                    "[hls_time=2:hls_list_size=3:hls_flags=delete_segments]",
                hlsKeep: false,
            },
        ],
        MediaRoot: "./media",
    },
};

module.exports = () => {
    var nms = new NodeMediaServer(config);
    nms.run();
};
