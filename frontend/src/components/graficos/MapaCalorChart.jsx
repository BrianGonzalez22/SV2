import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid, ResponsiveContainer } from 'recharts';

const HeatmapChart = ({ data }) => {
  // Función para asignar colores basada en la predicción
  const getColor = (value) => {
    if (value < 5) return "#32129a";
    if (value < 10) return "#a569bd";
    if (value >= 15) return "#5b2c6f";
    if (value < 15) return "#884ea0";
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