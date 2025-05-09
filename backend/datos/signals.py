from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Mensaje
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
import json

@receiver(post_save, sender=Mensaje)
def notificar_nuevo_mensaje(sender, instance, created, **kwargs):
    if created:
        print(f"Nuevo mensaje creado: {instance.texto}")  # Log para verificar que se creó el mensaje
        
        # Acceder al canal
        channel_layer = get_channel_layer()
        
        # Asegurarse de que el canal exista
        if channel_layer:
            print(f"Enviando mensaje al grupo 'mensajes': {instance.texto}")  # Log para verificar el envío
            async_to_sync(channel_layer.group_send)(
                'mensajes',  # Grupo al que React está suscrito
                {
                    'type': 'nuevo.mensaje',  # Tipo de mensaje que React espera
                    'message': instance.texto  # El mensaje a enviar
                }
            )
        else:
            print("Error: No se pudo acceder al channel_layer.")
