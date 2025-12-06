import socket
import json

def enviar_mensagem(sock, mensagem: str):
    """Envia mensagem JSON codificada em UTF-8."""
    try:
        sock.sendall(mensagem.encode("utf-8"))
    except Exception as e:
        print("Erro ao enviar mensagem:", e)
        raise

def receber_resposta(sock):
    """Recebe JSON do servidor."""
    try:
        data = sock.recv(2048)
        resposta_str = data.decode("utf-8").strip()
        resposta_json = json.loads(resposta_str)
        return resposta_json
    except Exception as e:
        print("Erro ao receber resposta:", e)
        raise

def enviar_info(port: int, ip: str):
    servico_device = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    servico_device.connect((ip, port))
    data = {
        "ip_device": "localhost",
        "port_device": 5001,
        "action": "save_device",
        "name_device": "Sensor de Temperatura",
        "status_device": "ativo",
        "type_device": "sensor",

    }

    data = json.dumps(data)
    enviar_mensagem(servico_device, data)
    receber_resposta(servico_device)
