from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Mensaje
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
import json

@receiver(post_save, sender=Mensaje)
def notificar_nuevo_mensaje(sender, instance, created, **kwargs):
    if created:
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            'mensajes',  # grupo al que React está suscrito
            {
                'type': 'nuevo.mensaje',
                'message': instance.texto
            }
        )
