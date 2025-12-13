import socket
import json

HOST = "localhost"
PORT = 7890

mensagem = {
    "id_client": "123321",
    "action_client": "escrever",
    "name_device": "Lampada Sala",
    "action": "escrever",
    "parametros": {
        "status": "ligado"
    }
}

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.connect((HOST, PORT))
sock.sendall(json.dumps(mensagem).encode("utf-8"))

resposta = sock.recv(4096)
print("Resposta do gateway:", resposta.decode())

sock.close()
