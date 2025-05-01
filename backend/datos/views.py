from django.shortcuts import render
from django.contrib.auth import authenticate
from rest_framework import viewsets, permissions
from .serializers import *
from .models import Registros
from rest_framework.response import Response
from django.db.models import Count, When, Case, Value, CharField, F
from .models import *
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework import status
from .utils import obtener_inicio_y_fin_del_dia
from collections import defaultdict
import pandas as pd
from prophet import Prophet
from datetime import datetime, timedelta
from rest_framework.views import APIView
from django.db.models.functions import TruncDate
import holidays
from django.core.cache  import cache
from django.http import JsonResponse

class RegistroViewset(viewsets.ModelViewSet):  
    permission_classes = [permissions.AllowAny]
    queryset = Registros.objects.select_related("usuario").all()  
    serializer_class = RegistrosSerializer

    def list(self, request):
        queryset = self.get_queryset()  
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

@api_view(['POST'])
def register_user(request):
    data = request.data
    # Validar si los campos existen
    if not data.get('username') or not data.get('password'):
        return Response({'error': 'Username y password son requeridos'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Validar si el usuario ya existe
    if User.objects.filter(username=data['username']).exists():
        return Response({'error': 'El usuario ya existe'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Crear el usuario
    user = User.objects.create(
        username=data['username'],
        password=make_password(data['password']),
        email=data.get('email', '')
    )
    return Response({'message': 'Usuario creado exitosamente'}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def obtener_registro_por_id(request):
    inicio_dia, fin_dia = obtener_inicio_y_fin_del_dia()

    # Obtener todas las entradas dentro del rango de la fecha
    entradas = Registros.objects.filter(
        fecha__gte=inicio_dia,
        fecha__lt=fin_dia,
        movimiento='entrada'
    )

    # Filtrar solo las entradas que no tienen una salida correspondiente
    registros_entrada_sin_salida = []
    for entrada in entradas:
        salida = Registros.objects.filter(
            movimiento='salida',
            usuario_id=entrada.usuario_id,
            vehiculo_id=entrada.vehiculo_id,
            fecha__gte=entrada.fecha,
            fecha__lt=fin_dia
        ).exists()

        # Si no existe una salida, se agrega a la lista
        if not salida:
            registros_entrada_sin_salida.append(entrada)

    # Agrupar por rol de usuario, combinando "docente" y "administrativo" en un solo grupo
    registros_agrupados = (
        Registros.objects.filter(id__in=[r.id for r in registros_entrada_sin_salida])
        .annotate(
            rol_agrupado=Case(
                When(usuario__rol='docente', then=Value('docente_admin')),
                When(usuario__rol='administrativo', then=Value('docente_admin')),
                default=F('usuario__rol'),
                output_field=CharField()
            )
        )
        .values('rol_agrupado')
        .annotate(count=Count('id'))
    )

    # Crear la respuesta de los registros agrupados
    resultados = [{'rol': registro['rol_agrupado'], 'count': registro['count']} for registro in registros_agrupados]

    return Response(resultados)

def obtener():
    inicio_dia, fin_dia = obtener_inicio_y_fin_del_dia()
    # Obtener todos los usuarios que tienen al menos una entrada registrada
    entradas = Registros.objects.filter(movimiento='entrada', fecha__gte=inicio_dia, fecha__lt=fin_dia)
    
    usuarios_con_entrada_y_salida = []

    # Iterar sobre las entradas
    for entrada in entradas:
        # Buscar si existe una salida para la misma entrada (mismo usuario y vehículo)
        salida = Registros.objects.filter(
            movimiento='salida',
            usuario_id=entrada.usuario_id,
            vehiculo_id=entrada.vehiculo_id,
            fecha__gt=entrada.fecha,
            fecha__gte=inicio_dia, 
            fecha__lt=fin_dia,
            
        )
        
        for salida in salida:
            # Si existe una salida correspondiente, agregar el usuario y el vehículo a la lista
            usuarios_con_entrada_y_salida.append({
                'usuario_id': entrada.usuario_id,
                'vehiculo_id': entrada.vehiculo_id,
                'entrada': entrada.fecha,
                'salida': salida.fecha
            })
    # Iterar sobre la lista y mostrar los resultados
    
    return usuarios_con_entrada_y_salida


def obtener_datos_grafico():
    # Llamar a la función que calcula el promedio por 2 horas
    data = calcular_promedio_por_hora()
    
    # Usar el serializador para estructurar los datos, asegurándote de pasar los datos como 'data'
    serializer = PromedioEstanciaSerializer(data=data, many=True)
    
    # Validar y devolver los datos serializados en la respuesta
    if serializer.is_valid():
        return serializer.data
    else:
       return {"error": serializer.errors}
    

def calcular_promedio_por_hora():
    # Obtener la lista de usuarios con entrada y salida
    usuarios_con_entrada_y_salida = obtener()

    # Crear una lista de estancias con sus intervalos de 1 hora
    estancias = []
    for usuario in usuarios_con_entrada_y_salida:
        entrada = usuario['entrada']
        salida = usuario['salida']

        # Calcular la duración de la estancia en minutos
        tiempo_estancia = (salida - entrada).total_seconds() / 60  # Convertir a minutos

        # Iterar por todos los intervalos de 1 hora entre la entrada y la salida
        hora_actual = entrada
        while hora_actual < salida:
            # Calcular el intervalo de 1 hora en el que cae la entrada
            hora_inicio_intervalo = hora_actual.hour
            intervalo = f'{hora_inicio_intervalo}:00 - {hora_inicio_intervalo + 1}:00'

            # Agregar la estancia con el intervalo, el tiempo de estancia y la hora de inicio
            estancias.append({
                'usuario_id': usuario['usuario_id'],
                'intervalo': intervalo,
                'tiempo_estancia': tiempo_estancia,
                'hora_inicio': hora_inicio_intervalo  # Guardar la hora de inicio para ordenarlo luego
            })

            # Avanzar una hora
            hora_actual += timedelta(hours=1)

    # Agrupar las estancias por intervalo de 1 hora
    agrupados_por_intervalo = defaultdict(list)
    for estancia in estancias:
        agrupados_por_intervalo[estancia['intervalo']].append(estancia)

    # Calcular el promedio ponderado por intervalo de 1 hora
    promedio_ponderado_por_intervalo = []
    for intervalo, estancias_en_intervalo in agrupados_por_intervalo.items():
        # Sumar todos los tiempos de ocupación y contar los usuarios
        total_tiempos = sum(estancia['tiempo_estancia'] for estancia in estancias_en_intervalo)
        total_usuarios = len(estancias_en_intervalo)
        
        # Calcular el promedio ponderado
        promedio = total_tiempos / total_usuarios if total_usuarios > 0 else 0

        # Obtener la hora de inicio (tomamos la hora de la primera estancia en ese intervalo)
        hora_inicio = estancias_en_intervalo[0]['hora_inicio']
        
        # Agregar el resultado para ese intervalo
        promedio_ponderado_por_intervalo.append({
            'intervalo': intervalo,
            'tiempo_estancia_promedio': promedio,
            'hora_inicio': hora_inicio  # Incluimos la hora de inicio para ordenar luego
        })

    # Ordenar los intervalos por la hora de inicio del intervalo (numéricamente)
    promedio_ponderado_por_intervalo.sort(key=lambda x: x['hora_inicio'])

    return promedio_ponderado_por_intervalo


#-------------------------------------------------Vistas del modelo prophet------------------------------------------------#

#Vista para la predicción de ocupacion basado en entradas

def predecir_ocupacion_prophet():

    # mx_holidays = holidays.Mexico(years=[2024, 2025, 2026])
    # fechas_festivas = pd.DataFrame({
    # 'holiday': 'festivo',
    # 'ds': pd.to_datetime([fecha for fecha in mx_holidays]),
    # 'lower_window': 0,
    # 'upper_window': 0
    # })

    cached_data = cache.get("prediccion_ocupacion")

    if cached_data:
        return cached_data

    ahora = datetime.now()
    inicio_dia = ahora.replace(hour=5, minute=0, second=0, microsecond=0)
    fin_dia = ahora.replace(hour=23, minute=0, second=0, microsecond=0)

    # Obtener registros hasta el momento actual
    registros = Registros.objects.filter(fecha__lte=ahora, movimiento='entrada').values('fecha', 'usuario_id')

    if not registros:
        return Response({"error": "No hay registros disponibles para la predicción."}, status=400)

    # Convertir a DataFrame
    df = pd.DataFrame(registros)
    df['fecha'] = pd.to_datetime(df['fecha'])
    df['count'] = 1

    # Agrupar por hora para obtener la ocupación por hora
    df = df.resample('h', on='fecha').count().reset_index()

    # Renombrar columnas para Prophet (debe ser 'ds' y 'y')
    df = df.rename(columns={'fecha': 'ds', 'count': 'y'})

    # Crear y ajustar el modelo
    modelo = Prophet()
    modelo.fit(df)

    # Generar predicciones para las próximas 24 horas
    futuro = modelo.make_future_dataframe(periods=24, freq='h')
    predicciones = modelo.predict(futuro)

    # Filtrar predicciones solo para hoy
    predicciones_filtradas = predicciones[
        (predicciones['ds'] >= inicio_dia) & (predicciones['ds'] <= fin_dia)
    ]

    # Seleccionar y formatear las predicciones
    resultado = predicciones_filtradas[['ds', 'yhat']]

    respuesta = [
        {
            'hora': row['ds'].strftime('%Y-%m-%dT%H:%M:%S'),
            'prediccion': max(0, int(row['yhat']))  # Evitar valores negativos
        }
        for _, row in resultado.iterrows()
    ]

    cache.set("prediccion_ocupacion", respuesta , timeout=1800)
    return respuesta

#Vista para predecir la capacidad general del estacionamiento cada hora

def predecir_dispo():

    cached_data = cache.get("prediccion_dispo")

    if cached_data:
        return cached_data
    
    estancias = emparejar_entradas_salidas()
    # Paso 3: Calcular lugares disponibles
    disponibilidad = calcular_lugares_disponibles(estancias)

    # Paso 2: Preparar datos para Prophet
    data = preparar_datos_para_prophet(disponibilidad)

    # Paso 3: Entrenar el modelo
    modelo = entrenar_modelo_prophet(data)
    
    # Paso 4: Hacer predicciones
    predicciones = hacer_predicciones(modelo, periodos=24)

    predicciones_json = predicciones_a_json(predicciones)

    cache.set("prediccion_dispo", predicciones_json, timeout = 1800)
    # Devolver como respuesta JSON
    return predicciones_json
#-------------------------------------------------Vistas del modelo prophet------------------------------------------------#


#PRUEBAS##
def usuario():
    inicio_dia, fin_dia = obtener_inicio_y_fin_del_dia()

    entradas = Registros.objects.filter(movimiento='entrada', fecha__gte=inicio_dia, fecha__lt=fin_dia)
    salidas = Registros.objects.filter(movimiento='salida', fecha__gte=inicio_dia, fecha__lt=fin_dia)

    for x in entradas:
        print(f"id: {x.usuario} entrada")

    for x in salidas:
        print(f"id: {x.usuario} salida")
#PRUEBAS##


#-------------------------------------------PREPARACION PARA CALCULAR DISPONIBILIDAD------------------------------------#
def emparejar_entradas_salidas():
    hoy= datetime.now()
    registros = Registros.objects.filter(fecha__lte=hoy).order_by('fecha')

    usuarios_entradas = defaultdict(list)
    usuarios_salidas = defaultdict(list)
    estancias = []

    for registro in registros:
        if registro.movimiento == "entrada":
            usuarios_entradas[registro.usuario_id].append(registro)
        elif registro.movimiento == "salida":
            # Verifica si hay una entrada previa para el usuario
            if usuarios_entradas[registro.usuario_id]:
                entrada = usuarios_entradas[registro.usuario_id].pop(0)  # Primera entrada
                estancias.append({
                    'usuario_id': registro.usuario_id,
                    'entrada': entrada.fecha,
                    'salida': registro.fecha
                })
            else:
                usuarios_salidas[registro.usuario_id].append(registro)
    
        # Añadir entradas sin salida hasta ahora
    for usuario_id, entradas in usuarios_entradas.items():
        for entrada in entradas:
            estancias.append({
                'usuario_id': usuario_id,
                'entrada': entrada.fecha,
                'salida': datetime.now()  # Asumimos que siguen dentro
            })

    return estancias

def calcular_lugares_disponibles(estancias):
    TOTAL_LUGARES = 333

    # Crear eventos de entradas (+1) y salidas (-1)
    eventos = []
    for estancia in estancias:
        eventos.append((estancia['entrada'], 1))
        eventos.append((estancia['salida'], -1))
    
    # Ordenar los eventos por fecha
    eventos.sort()

    # Calcular lugares disponibles en cada momento
    ocupados = 0
    disponibilidad_por_momento = []
    
    for fecha, cambio in eventos:
        ocupados += cambio
        lugares_disponibles = max(TOTAL_LUGARES - ocupados, 0)
        disponibilidad_por_momento.append((fecha, lugares_disponibles))

    # Agrupar por hora
    disponibilidad_por_hora = defaultdict(list)
    
    for fecha, lugares_disponibles in disponibilidad_por_momento:
        hora_redondeada = fecha.replace(minute=0, second=0, microsecond=0)
        disponibilidad_por_hora[hora_redondeada].append(lugares_disponibles)

    # Calcular el promedio por hora
    resultado = []
    for hora, valores in disponibilidad_por_hora.items():
        promedio = sum(valores) / len(valores)
        resultado.append({'fecha': hora, 'lugares_disponibles': round(promedio)})

    # Ordenar el resultado por fecha
    resultado.sort(key=lambda x: x['fecha'])
    
    return resultado



def preparar_datos_para_prophet(disponibilidad):
    df = pd.DataFrame(disponibilidad)
    df = df.rename(columns={'fecha': 'ds', 'lugares_disponibles': 'y'})
    return df

def entrenar_modelo_prophet(data):
    # Crear y configurar el modelo
    modelo = Prophet()
    modelo.fit(data)

    return modelo

def hacer_predicciones(modelo, periodos=24):
    # Crear fechas futuras para predicciones (periodos en horas)
    futuro = modelo.make_future_dataframe(periods=periodos, freq='h')
    
    # Hacer predicciones
    predicciones = modelo.predict(futuro)
    return predicciones

def predicciones_a_json(predicciones, max_lugares=333):
    # Obtener la fecha actual sin horas, minutos y segundos
    fecha_actual = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)

    # Filtrar solo las predicciones a partir de hoy
    predicciones_futuras = predicciones[predicciones['ds'] >= fecha_actual]

    # Filtrar solo las predicciones hasta el final del día de hoy (hasta las 23:59:59)
    fin_del_dia = fecha_actual.replace(hour=23, minute=59, second=59, microsecond=999999)
    predicciones_futuras = predicciones_futuras[predicciones_futuras['ds'] <= fin_del_dia]

    # Seleccionar y renombrar las columnas
    resultados = predicciones_futuras[['ds', 'yhat']].rename(columns={
        'ds': 'fecha',
        'yhat': 'ocupacion_esperada'
    })

    # Limitar el valor de ocupación a 333
    resultados['ocupacion_esperada'] = resultados['ocupacion_esperada'].apply(lambda x: min(max_lugares, max(0, int(x))))

    # Convertir a JSON
    resultados_json = resultados.to_dict(orient='records')
    return resultados_json


#-------------------------------------------PREPARACION PARA CALCULAR DISPONIBILIDAD------------------------------------#

#-------------------------------------------PRUEBA DE UNA SOLA VISTA------------------------------------#

class GraficoData(APIView):
    def get(self, request):
        # Obtener los datos para el primer gráfico
        datos_prophet = predecir_dispo()
        
        # Obtener los datos para el segundo gráfico
        datos_dispo = predecir_ocupacion_prophet()

        # Obtener los datos para el tercer gráfico
        datos_ocupacion = obtener_datos_grafico()

        # Devuelves todo junto en un solo objeto
        return Response({
            'prophet': datos_prophet,
            'dispo': datos_dispo,
            'ocupacion': datos_ocupacion,
        })
#-------------------------------------------PRUEBA DE UNA SOLA VISTA------------------------------------#

@api_view(['GET'])
def obtener_datos(request):
    vehiculos = VehiculoSerializer(Vehiculos.objects.all(), many=True).data
    usuarios = UsuarioSerializer(Usuarios.objects.all(), many=True).data
    #registros = RegistroSerializer(Registros.objects.all(), many=True).data

    return Response({
        "vehiculos": vehiculos,
        "usuarios": usuarios,
       # "registros": registros,
    })

@api_view(['GET'])
def obtener_fechas_registros(request):
    anio = request.query_params.get('anio')
    mes = request.query_params.get('mes')

    if anio and mes:
        registros = Registros.objects.filter(
            fecha__year=anio,
            fecha__month=mes
        ).dates('fecha', 'day')  # Obtener solo fechas únicas por día

        # Retornar solo el número de día
        dias = [fecha.day for fecha in registros]
        return Response(sorted(dias))
    else:
        return Response([])  # Retorna vacío si no se recibe año y mes


@api_view(['GET'])
def obtener_registros_filtrados(request):
    fecha_inicio = request.query_params.get('fecha_inicio')
    fecha_fin = request.query_params.get('fecha_fin')

    print(f"fecha_inicio: {fecha_inicio}, fecha_fin: {fecha_fin}")  # Agrega esta línea para depurar

    if fecha_inicio and fecha_fin:
        # Convertir las fechas recibidas a objetos datetime
        fecha_inicio = datetime.strptime(fecha_inicio, "%Y-%m-%dT%H:%M:%S")
        fecha_fin = datetime.strptime(fecha_fin, "%Y-%m-%dT%H:%M:%S")

        # Filtrar los registros por el rango de fecha
        registros = Registros.objects.filter(fecha__range=[fecha_inicio, fecha_fin])
    else:
        registros = Registros.objects.all()

    # Serializar y devolver los registros
    serializer = RegistrosSerializer(registros, many=True)
    return Response(serializer.data)

def buscar_usuarios(request):
    nombre = request.GET.get('nombre', '').strip()
    matricula = request.GET.get('matricula', '').strip()

    if not nombre:
        return JsonResponse({'error': 'Nombre es requerido.'}, status=400)

    usuarios = Usuarios.objects.filter(nombre__icontains=nombre)

    if matricula:
        usuarios = usuarios.filter(matricula__iexact=matricula)

    data = [
        {
            'id': u.id,
            'nombre': u.nombre,
            'correo': u.correo,
            'matricula': u.matricula,
        }
        for u in usuarios
    ]

    return JsonResponse(data, safe=False)  # data debe ser una lista
