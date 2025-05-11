import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


const EstanciaPromedioChart = ({ data }) => {
  const [chartData, setChartData] = useState([]);

  // Transformar los datos para el gráfico
  useEffect(() => {
    // Si los datos se pasan como prop, no necesitas hacer la solicitud a la API
    if (data.length > 0) {
      const transformedData = data.map((item) => ({
        hora: item.intervalo,  // Usamos "intervalo" como hora
        minutos: Math.round(item.tiempo_estancia_promedio), // Redondeamos el tiempo de estancia
      }));
      setChartData(transformedData);  // Establecemos los datos transformados
    }
  }, [data]);  // Este useEffect solo se ejecutará cuando 'data' cambie

  return (
    <div>
      {/* Verificamos si los datos están disponibles antes de renderizar el gráfico */}
      {chartData.length > 0 ? (
        <LineChart width={370} height={400} data={chartData}>
          {/* Cuadrícula de fondo */}
          <CartesianGrid strokeDasharray="3 3" />
          
          {/* Eje X y Eje Y */}
          <XAxis dataKey="hora" />
          <YAxis label={{ value: 'Minutos', angle: -90, position: 'insideLeft' }} />
          
          {/* Tooltip para información al pasar el mouse */}
          <Tooltip />
          
          {/* Leyenda */}
          <Legend />
          
          {/* Línea principal con estilo */}
          <Line type="monotone" dataKey="minutos" stroke="#32129a" strokeWidth={2} />
        </LineChart>
      ) : (
        <p>Cargando datos...</p>  // Mostrar un mensaje de carga mientras los datos no estén disponibles
      )}
    </div>
  );
};

export default EstanciaPromedioChart;
