import React, { useEffect, useState } from 'react';
import AxiosInstance from '../axios'; // Ajusta la ruta de AxiosInstance
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#00C49F','#FFBB28','#0088FE'];

const PieChartComponent = () => {
  const [data, setData] = useState([]);

  // Función para obtener los datos del backend
  const fetchData = async () => {
    try {
      const response = await AxiosInstance.get('obtener-registros/'); // Cambia la ruta según tu API
      const rolesData = response.data;

      // Convertir la respuesta en el formato esperado por el gráfico
      const formattedData = rolesData.map(rol => ({
        name: rol.rol,
        value: rol.count
      }));

      setData(formattedData);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  useEffect(() => {
    fetchData(); // Obtener los datos cuando se monta el componente
  
     // Actualizar automáticamente cada 5 segundos
     const interval = setInterval(() => {
      fetchData();
    }, 600000); // Cambia el tiempo según tu necesidad (5000 ms = 5 segundos)

    return () => clearInterval(interval); // Limpiar el intervalo al desmontar el componente
  
  }, []);

  // Calcular el total de los valores para calcular el porcentaje
  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div style={{ width: '100%', height: 400, marginTop: '-60px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            dataKey="value"
            label={({ name,  }) => `${name}`} // Mostrar porcentaje en el gráfico
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Leyenda personalizada */}
      <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', marginTop: '-40px' }}>
        {data.map((entry, index) => {
          // Calcular el porcentaje de cada entrada
          const percentage = ((entry.value / total) * 100).toFixed(2);

          return (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: COLORS[index % COLORS.length],
                  marginRight: '5px',
                }}
              />
              <div>{`${entry.name}: ${entry.value} (${percentage}%)`}</div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PieChartComponent;
