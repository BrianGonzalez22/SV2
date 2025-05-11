import React, { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";  // Importamos componentes de Recharts

const GraficoOcupacion = ({data}) => {
  const [graficoData, setGraficoData] = useState([]);

  useEffect(() => {
    if (data) {
      setGraficoData(data);
    }
  }, [data]); // Se actualiza si cambian los props

  console.log(graficoData)

  return (
    <div>
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={graficoData}>
          {/* Ejes X e Y */}
          <XAxis dataKey="fecha" tick={{ fontSize: 12 }} tickFormatter={(value) => new Date(value).toLocaleString()} />
          <YAxis tick={{ fontSize: 12 }} />
          
          {/* Añadimos una cuadrícula */}
          <CartesianGrid strokeDasharray="3 3" />
          
          {/* Tooltip para mostrar información detallada */}
          <Tooltip formatter={(value) => `${value.toFixed(2)} lugares`} />

          {/* Leyenda */}
          <Legend />

          {/* Línea del gráfico de ocupación esperada */}
          <Line
            type="monotone"
            dataKey="ocupacion_esperada"
            stroke='#32129a' // Color de la línea
            activeDot={{ r: 8 }} // Puntos activos en la línea
            strokeWidth={2}
            dot={false} // Si no quieres mostrar los puntos individuales en la línea
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
export default GraficoOcupacion;
