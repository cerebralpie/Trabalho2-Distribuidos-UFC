const Net = require("net");
const fs = require("fs");

function criarRequisicaoProtobuf(action, parametros = {}) {
  return {
    operacao: {
      operacao: action === "ler" ? "LER" : "ESCREVER",
      parametros
    }
  };
}


function processarRequisicao(payload) {

  if (!CLIENTES_VALIDOS.includes(payload.id_client)) {
    return { status: "error", message: "Cliente não autorizado" };
  }

  if (!payload.name_device || !payload.action) {
    return { status: "error", message: "Campos obrigatórios ausentes" };
  }

  const dados = carregarDados();
  const dispositivo = buscarDispositivo(dados, payload.name_device);

  if (!dispositivo) {
    return { status: "error", message: "Dispositivo não encontrado" };
  }

  const msg = criarRequisicaoProtobuf(
    payload.action.toLowerCase(),
    payload.parametros || {}
  );

  // ENVIO REAL AO DISPOSITIVO
  enviarOrdemDevice(
    dispositivo.ip_device,
    dispositivo.port_device,
    msg
  );

  return {
    status: "ok",
    enviado_para: dispositivo.name_device,
    ip: dispositivo.ip_device,
    port: dispositivo.port_device,
    requisicao: msg
  };
}




//////
function processarRequisicao(payload) {

  if (!CLIENTES_VALIDOS.includes(payload.id_client)) {
    return { status: "error", message: "Cliente não autorizado" };
  }

  if (!payload.name_device || !payload.action) {
    return { status: "error", message: "Campos obrigatórios ausentes" };
  }

  const dados = carregarDados();
  const dispositivo = buscarDispositivo(dados, payload.name_device);

  if (!dispositivo) {
    return { status: "error", message: "Dispositivo não encontrado" };
  }

  const msg = criarRequisicaoProtobuf(
    payload.action.toLowerCase(),
    payload.parametros || {}
  );

  // ENVIO REAL AO DISPOSITIVO
  enviarOrdemDevice(
    dispositivo.ip_device,
    dispositivo.port_device,
    msg
  );

  return {
    status: "ok",
    enviado_para: dispositivo.name_device,
    ip: dispositivo.ip_device,
    port: dispositivo.port_device,
    requisicao: msg
  };
}



function iniciarServidorTCP_ReceiveClient(port = 7890) {
  const server = new Net.Server();

  server.on("connection", socket => {
    console.log("Cliente conectado:", socket.remoteAddress);

    socket.on("data", buffer => {
      try {
        const payload = JSON.parse(buffer.toString());
        console.log("Requisição recebida:", payload);

        const resposta = processarRequisicao(payload);
        socket.write(JSON.stringify(resposta) + "\n");

      } catch {
        socket.write(JSON.stringify({
          status: "error",
          message: "JSON inválido"
        }) + "\n");
      }
    });
  });

  server.listen(port, () =>
    console.log(`Gateway TCP rodando na porta ${port}`)
  );
}
