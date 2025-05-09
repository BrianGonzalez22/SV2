import os
import django
import random
import string
import uuid

# Configurar el entorno de Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dashboard.settings')  # reemplaza 'tu_proyecto'
django.setup()

from datos.models import Usuarios  # reemplaza 'tu_app' con el nombre de tu aplicación

# Opciones válidas para el campo rol
roles = ['moto', 'administrativo', 'docente', 'alumno']

# Funciones auxiliares
def generar_nombre():
    nombres = ['Ana', 'Luis', 'Carlos', 'María', 'Pedro', 'Sofía', 'Jorge', 'Lucía']
    apellidos = ['García', 'Hernández', 'Martínez', 'López', 'Ramírez', 'Torres']
    return f"{random.choice(nombres)} {random.choice(apellidos)}"

def generar_correo_unico(nombre):
    dominios = ['gmail.com', 'outlook.com', 'universidad.edu']
    user = nombre.lower().replace(' ', '.') + '.' + str(uuid.uuid4())[:8]
    return f"{user}@{random.choice(dominios)}"

def generar_telefono():
    return ''.join(random.choices(string.digits, k=10))

def generar_matricula():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=9))
# Valor inicial de la matrícula
matricula_inicial = 19000000

# Número de usuarios a crear
usuarios_a_crear = 250

# Crear usuarios
for i in range(usuarios_a_crear):  # Cambia el número para crear más o menos usuarios
    nombre = generar_nombre()
    correo = generar_correo_unico(nombre)
    telefono = generar_telefono()
    rol = random.choice(roles)
    matricula = str(matricula_inicial + i)

    Usuarios.objects.create(
        nombre=nombre,
        correo=correo,
        telefono=telefono,
        rol=rol,
        matricula=matricula
    )

print("Usuarios generados correctamente.")
