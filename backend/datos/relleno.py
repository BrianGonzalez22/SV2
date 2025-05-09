import random
from datetime import datetime, timedelta, time
from datos.models import Registros, Usuarios, Vehiculos
import holidays

def generar_hora_aleatoria(hora_inicio, hora_fin):
    """Genera una hora aleatoria dentro del rango especificado."""
    inicio = datetime.combine(datetime.today(), hora_inicio)
    fin = datetime.combine(datetime.today(), hora_fin)
    delta = fin - inicio
    return inicio + timedelta(seconds=random.randint(0, int(delta.total_seconds())))
# modificar fecha para insertar registros
def insertar_registros(fecha_inicio='2023-01-01'):
    # Convertir la fecha de inicio y definir la fecha actual
    fecha_inicio = datetime.strptime(fecha_inicio, '%Y-%m-%d')
    fecha_actual = datetime.now()

    # Obtener usuarios y vehículos
    usuarios = list(Usuarios.objects.all())
    vehiculos = list(Vehiculos.objects.all())

    if not usuarios or not vehiculos:
        print("No hay usuarios o vehículos registrados.")
        return

    # Iterar desde la fecha de inicio hasta la fecha actual
    dias = (fecha_actual - fecha_inicio).days
    festivos_mx = holidays.Mexico(years=[2023,2024,2025])
    for dia in range(dias + 1):
        fecha_base = fecha_inicio + timedelta(days=dia)

        if fecha_base.weekday() == 6:
            continue

        registros_a_crear = []

        # Detectar si el día actual es festivo
        es_festivo = fecha_base.date() in festivos_mx

        # Si es festivo, reducir las entradas simuladas
        limite_usuarios = 30 if es_festivo else 250

        usuarios_para_entrada = random.sample(usuarios, min(len(usuarios), limite_usuarios))

        # Crear entradas
        entradas = {}
        for usuario in usuarios_para_entrada:
            # Verificar vehículos asociados
            vehiculos_usuario = Vehiculos.objects.filter(usuario=usuario)
            if not vehiculos_usuario:
                continue

            vehiculo = random.choice(vehiculos_usuario)
            hora_entrada = generar_hora_aleatoria(time(6, 0), time(22, 0))
            
            # Generar fecha y hora con microsegundos
            fecha_hora_entrada = fecha_base.replace(
                hour=hora_entrada.hour, 
                minute=hora_entrada.minute, 
                second=hora_entrada.second, 
                microsecond=random.randint(0, 999999)
            )

            registro_entrada = Registros(
                usuario=usuario,
                vehiculo=vehiculo,
                movimiento='entrada',
                fecha=fecha_hora_entrada
            )
            registros_a_crear.append(registro_entrada)
            entradas[usuario] = fecha_hora_entrada

        # Crear salidas
        for usuario, hora_entrada in entradas.items():
            vehiculos_usuario = Vehiculos.objects.filter(usuario=usuario)
            if not vehiculos_usuario:
                continue

            vehiculo = random.choice(vehiculos_usuario)

            # Generar salida entre 4 a 8 horas después
            horas_despues = random.randint(4, 8)
            hora_salida = hora_entrada + timedelta(hours=horas_despues)
            
            # Asegurarse de que la salida sea antes de las 11:59 PM
            hora_maxima_salida = fecha_base.replace(hour=23, minute=59, second=59)
            fecha_hora_salida = min(hora_salida, hora_maxima_salida)

            registro_salida = Registros(
                usuario=usuario,
                vehiculo=vehiculo,
                movimiento='salida',
                fecha=fecha_hora_salida
            )
            registros_a_crear.append(registro_salida)

        # Inserción masiva
        if registros_a_crear:
            Registros.objects.bulk_create(registros_a_crear)
            print(f"Registros creados para {fecha_base.date()} - Entradas: {len(entradas)}, Salidas: {len(registros_a_crear) - len(entradas)}")

    print("✅ Inserción finalizada con éxito.")

# Ejecutar la función
insertar_registros()
