import React, { useState } from 'react';
import AxiosInstance from './axios';
import { jsPDF } from 'jspdf';

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

  // Función para generar el PDF
  const generarPDF = () => {
    const doc = new jsPDF();
    
    // Agregar el contenido del reporte
    doc.text('Reporte de Ocupación', 10, 10);
    
    // Fecha de inicio y fin
    doc.text(`Fecha de inicio: ${new Date(reporte.fecha_inicio).toLocaleString()}`, 10, 20);
    doc.text(`Fecha de fin: ${new Date(reporte.fecha_fin).toLocaleString()}`, 10, 30);

    // Ocupación promedio
    doc.text(`Ocupación Promedio: ${reporte.ocupacion_promedio?.toFixed(2)}%`, 10, 40);

    // Tiempo promedio de permanencia
    doc.text(`Tiempo Promedio de Permanencia: ${reporte.tiempo_promedio}`, 10, 50);

    // Distribución por rol
    let yPosition = 60;
    doc.text('Distribución por Rol:', 10, yPosition);
    yPosition += 10;

    reporte.roles.forEach((rol, index) => {
      doc.text(`${rol.rol}: ${rol.cantidad}`, 10, yPosition);
      yPosition += 10;
    });

    // Agregar gráfico (base64)
    const img = `data:image/png;base64,${reporte.grafico}`;
    doc.addImage(img, 'PNG', 10, yPosition, 180, 100); // Puedes ajustar las coordenadas y el tamaño

    // Guardar el PDF
    doc.save('reporte.pdf');
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

          <button onClick={generarPDF} style={{ marginTop: '20px' }}>
            Descargar PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default PaginaReportes;
