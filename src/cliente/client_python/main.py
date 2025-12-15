import socket
import struct
import proto_gateway_pb2 as pb
from google.protobuf.json_format import MessageToJson

IP_SERVER = "localhost"
PORT_SERVER = 50120  # mesma porta do servidor

def enviar_protobuf(sock, msg):
    payload = msg.SerializeToString()
    header = struct.pack(">I", len(payload))
    sock.sendall(header + payload)

def receber_protobuf(sock, classe):
    header = sock.recv(4)
    if not header:
        return None
    tamanho = struct.unpack(">I", header)[0]
    payload = b""
    while len(payload) < tamanho:
        payload += sock.recv(tamanho - len(payload))
    msg = classe()
    msg.ParseFromString(payload)
    return msg

def listar_dispositivos():
    req = pb.Requisicao()
    req.listar.SetInParent()  # marca como listar

    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.connect((IP_SERVER, PORT_SERVER))
        enviar_protobuf(sock, req)
        resp = receber_protobuf(sock, pb.RespostaOkLista)
        print("Lista de dispositivos:")
        print(MessageToJson(resp, preserving_proto_field_name=True))

def ler_dispositivo():
    nome = input("Digite o nome do dispositivo para ler: ")
    req = pb.Requisicao()
    req.name_device = nome
    # req.type_device = "sensor"  # ou perguntar ao usuário
    req.name_client = "ClienteTeste"
    # req.escrever.info_device.type_device = "sensor"
    # req.ler.SetInParent()
    req.ler.operacao.operacao = pb.ComandoOperacao.LER


    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.connect((IP_SERVER, PORT_SERVER))
        enviar_protobuf(sock, req)
        # from proto_dispositivo_pb2 import Resposta
        resp = receber_protobuf(sock, pb.RespostaOk)
        print("Resposta da leitura:")
        print(MessageToJson(resp, preserving_proto_field_name=True))

def escrever_dispositivo():
    nome = input("Digite o nome do dispositivo para escrever: ")
    req = pb.Requisicao()
    req.name_device = nome
    req.operacao = "escrever"
    req.type_device = "atuador"  # ou perguntar ao usuário
    req.name_client = "ClienteTeste"

    # Exemplo de parâmetro
    key = input("Digite o parâmetro a alterar: ")
    value = input("Digite o valor do parâmetro: ")
    req.parametros[key] = value

    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.connect((IP_SERVER, PORT_SERVER))
        enviar_protobuf(sock, req)
        # from proto_dispositivo_pb2 import Resposta
        resp = receber_protobuf(sock, pb.RespostaOk)
        print("Resposta da escrita:")
        print(MessageToJson(resp, preserving_proto_field_name=True))

def main():
    while True:
        print("\nEscolha uma ação:")
        print("1 - Listar dispositivos")
        print("2 - Ler dispositivo")
        print("3 - Escrever dispositivo")
        print("0 - Sair")
        opcao = input("Opção: ").strip()

        if opcao == "1":
            listar_dispositivos()
        elif opcao == "2":
            ler_dispositivo()
        elif opcao == "3":
            escrever_dispositivo()
        elif opcao == "0":
            print("Saindo...")
            break
        else:
            print("Opção inválida!")

if __name__ == "__main__":
    main()
