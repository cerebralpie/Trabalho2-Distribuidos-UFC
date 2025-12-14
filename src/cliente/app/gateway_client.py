import grpc
from app.protobuf import gateway_pb2, gateway_pb2_grpc

class GatewayClient:
    def __init__(self):
        channel = grpc.insecure_channel("localhost:50051")
        self.stub = gateway_pb2_grpc.GatewayServiceStub(channel)

    def get_devices(self):
        response = self.stub.GetDevices(gateway_pb2.Empty())

        return [
            {
                "name": d.name,
                "type": d.type,
                "value": d.value,
                "status": d.status
            }
            for d in response.devices
        ]

    def send_command(self, actuator_id, command):
        req = gateway_pb2.Command(
            actuator_id=actuator_id,
            command=command
        )
        res = self.stub.SendCommand(req)
        return res.status

gateway = GatewayClient()
