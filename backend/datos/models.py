from django.db import models
from django.utils import timezone
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

# Create your models here.
class Usuarios(models.Model):
    nombre = models.CharField(max_length=100)
    correo = models.EmailField(unique=True)
    telefono = models.CharField(max_length=10)
    rol = models.CharField(max_length=20, null=True, blank=True)
    matricula = models.CharField(max_length=9)

class Vehiculos(models.Model):
    usuario = models.ForeignKey(Usuarios, on_delete=models.CASCADE)
    placa = models.CharField(max_length=10)
    modelo = models.CharField(max_length=50)
    color = models.CharField(max_length=30)
    tipo = models.CharField(max_length=30)
    estado = models.BooleanField(default=True)

class Registros(models.Model):
    usuario = models.ForeignKey(Usuarios, on_delete=models.CASCADE)
    vehiculo = models.ForeignKey(Vehiculos, on_delete=models.CASCADE)
    movimiento = models.CharField(max_length=30)
    fecha = models.DateTimeField()

    
