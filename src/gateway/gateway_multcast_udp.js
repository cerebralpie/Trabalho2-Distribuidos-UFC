// Source - https://stackoverflow.com/a
// Posted by dirkk0
// Retrieved 2025-12-05, License - CC BY-SA 4.0

var news = [
    "7895",
    "7895",
    "7895"
];

var dgram = require('dgram');
var server = dgram.createSocket("udp4");
server.bind(function () {
    server.setBroadcast(true)
    server.setMulticastTTL(128);
    setInterval(broadcastNew, 3000);
});

function broadcastNew() {
    var message = new Buffer.from(news[Math.floor(Math.random() * news.length)]);
    server.send(message, 0, message.length, 5007, "224.1.1.1");
    console.log("Enviando porta " + message + " para dispositivos na rede enviarem info...");
}


module.exports = { startTCPServer };
