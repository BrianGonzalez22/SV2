from channels.generic.websocket import AsyncWebsocketConsumer
import json

# consumers.py
class MensajeConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add('mensajes', self.channel_name)
        await self.accept()
        print("Cliente WebSocket conectado y unido al grupo 'mensajes'.")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard('mensajes', self.channel_name)

    async def nuevo_mensaje(self, event):
        mensaje = event['message']
        print(f"Recibido en consumidor WebSocket: {mensaje}")  # 👈 Este print es clave
        await self.send(text_data=json.dumps({'mensaje': mensaje}))

