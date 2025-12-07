const Net = require('net');
const port = 7895;
const server_tcp = new Net.Server();
const fs = require("fs");




function buscarDadosJSON(dados, name_device) {
    return dados.dispositivos.find(p => p.name_device === name_device) || null;
}


function enviarOrdemDevice(port, host, name_device, action, value=null)  {
    const client = new Net.Socket();

    client.connect({ port: port, host: host }, function() {

        let arquivo = fs.readFileSync("dados.json", "utf8");
        
        let json_arq = JSON.parse(arquivo);

        const resultado = buscarDadosJSON(json_arq, name_device);

        // resultado = resultado.dispositivos.find(p => p.name_device === name_device) || null;
        const dados = {
            name_device: resultado.name_device,
            porta: resultado.port_device,
            action: action,
            value: value
        };
            // "ip_device": "localhost",
            // "port_device": 5001,
            // "action": "save_device",
            // "name_device": "Sensor de InfraVermelho",
            // "status_device": "ativo",
            // "type_device": "sensor",
            // "value_device": null

        client.write(JSON.stringify(dados));
    });


    client.on("data", (data) => {
        try {
            const resposta = JSON.parse(data.toString());
            
            console.log("Resposta do servidor:", resposta);
        } catch (err) {
            console.log("Erro ao ler JSON:", err);
        }
    });

    client.on("close", () => {
        console.log("Conexão encerrada");
    });
}


// const resultado = buscarDadosJSON(json_arq, "Sensor de Temperatura");

enviarOrdemDevice(5001, "localhost", "Sensor de InfraVermelho", "set_value", value=123)



// 
// 
// 
// 
// função para receber dados iniciais do dispositivo
// server_tcp.on('connection', (socket) => {
    // console.log("Cliente conectado");
// 
    // let arquivo = fs.readFileSync("dados.json", "utf8");
    // 2. Converte de texto → JSON
    // let json_arq = JSON.parse(arquivo);
    // console.log("Conteúdo do arquivo:", json_arq);
    // 
    // 
    // name_device = null;
    // status_device = null;
    // type_device = null;
// 
    // const estados = ["ativo", "desligado", "ATIVO", "DESLIGADO"];
// 
    // salvar informações do dispositivo
    // socket.on('data', (data) => {
        // try {
            // const json = JSON.parse(data.toString());
            // console.log("JSON recebido:", json);
            // console.log("Ação recebida:", json.action);
// 
            // switch (json.action) {
                // case "save_device":
                    // console.log("Salvando nome do dispositivo...");
                    // if (!json.name_device || !json.status_device || !json.type_device) {
                        // console.log("Faltando campos obrigatórios");
                        // socket.write(JSON.stringify({
                            // status: "error",
                            // message: "Faltando campos obrigatórios"
                        // }) + "\n");
                        // return
                    // }
                    // if (!estados.includes(json.status_device)) {
                        // console.log("Status do dispositivo inválido");
                        // socket.write(JSON.stringify({
                            // status: "error",
                            // message: "Status do dispositivo inválido"
                        // }) + "\n");
                        // return
                    // }
                    // if (!json.type_device === "sensor" || !json.type_device === "atuador") {
                        // console.log("Tipo do dispositivo inválido");
                        // socket.write(JSON.stringify({
                            // status: "error",
                            // message: "Tipo do dispositivo inválido"
                        // }) + "\n");
                        // return
                    // }
                    // json_received = {
                        // ip_device: socket.remoteAddress,
                        // port_device: socket.remotePort,
                        // name_device: json.name_device,
                        // status_device: json.status_device,
                        // type_device: json.type_device
                    // };
                    // console.log("Dados do dispositivo:", json_received);
// 
// 
                    // json_arq.dispositivos.push(json_received);
                    // fs.writeFileSync("dados.json", JSON.stringify(json_arq, null, 4));
// 
                    // console.log("Dados do dispositivo:", json_received);
                    // name_device = json.name_device;
                    // socket.write(JSON.stringify({
                        // status: "ok",
                        // message: `Dispositivo salvo com sucesso registrado: ${json.name}`
                    // }) + "\n");
                    // break;
                // default:
                    // socket.write(JSON.stringify({
                        // status: "error",
                        // message: "Ação desconhecida"
                    // }) + "\n");
            // }
            // 
        // } catch (e) {
            // socket.write(JSON.stringify({
                // status: "error",
                // message: "JSON inválido"
            // }) + "\n");
        // }
    // });
// 
    // socket.on('end', () => console.log("Dispositivo ", json.name_device," desconectado"));
// });
// 