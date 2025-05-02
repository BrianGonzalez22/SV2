import React, { useState } from 'react';
import AxiosInstance from './axios';

const PaginaReportes = () => {
  const [inicio, setInicio] = useState('');
  const [fin, setFin] = useState('');
  const [reporte, setReporte] = useState(null);

  const obtenerReporte = () => {
    AxiosInstance.get('generar-reporte/', {
      params: { inicio, fin }
    })
      .then(response => {
        setReporte(response.data);
      })
      .catch(error => {
        console.error('Error al generar el reporte:', error);
        setReporte(null);
      });
  };

  return (
    <div>
      <h2>Generar Reporte</h2>

      <label>Fecha de inicio:</label>
      <input
        type="datetime-local"
        value={inicio}
        onChange={(e) => setInicio(e.target.value)}
      />

      <label>Fecha de fin:</label>
      <input
        type="datetime-local"
        value={fin}
        onChange={(e) => setFin(e.target.value)}
      />

      <button onClick={obtenerReporte}>Generar Reporte</button>

      {reporte && (
        <div style={{ marginTop: '20px' }}>
          <h3>Ocupación Promedio: {reporte.ocupacion_promedio?.toFixed(2)}%</h3>
          <h3>Tiempo Promedio de Permanencia: {reporte.tiempo_promedio}</h3>
          <p>Desde: {new Date(reporte.fecha_inicio).toLocaleString()}</p>
          <p>Hasta: {new Date(reporte.fecha_fin).toLocaleString()}</p>

          <h4>Distribución por Rol:</h4>
          <ul>
            {reporte.roles.map((rol, index) => (
              <li key={index}>{rol.rol}: {rol.cantidad}</li>
            ))}
          </ul>

          <img
            src={`data:image/png;base64,${reporte.grafico}`}
            alt="Gráfico de distribución por rol"
            style={{ maxWidth: '100%', height: 'auto', marginTop: '20px' }}
          />
        </div>
      )}
    </div>
  );
};

export default PaginaReportes;
