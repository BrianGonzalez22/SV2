import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid, ResponsiveContainer } from 'recharts';

const HeatmapChart = ({ data }) => {
  // Función para asignar colores basada en la predicción
  const getColor = (value) => {
    if (value < 5) return "#b9fbc0";
    if (value < 10) return "#98f5e1";
    if (value > 17) return "#57cc99";
    if (value < 16) return "#38a3a5";
    return "#22577a";
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hora" />
        <YAxis label={{ value: "Entradas", angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Bar dataKey="prediccion">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getColor(entry.prediccion)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default HeatmapChart;