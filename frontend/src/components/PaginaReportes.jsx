import React, { useState } from 'react';
import AxiosInstance from './axios';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

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

  const generarPDF = async () => {
    const input = document.getElementById('reporte-pdf');
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');
  
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('reporte.pdf');
  };

  const getLocalDateTime = () => {
    const now = new Date();
    now.setSeconds(0, 0); // limpia segundos y milisegundos
    const offset = now.getTimezoneOffset();
    const localTime = new Date(now.getTime() - offset * 60000);
    return localTime.toISOString().slice(0, 16);
  };
  
  return (
    <div>
      <h2>Generar Reporte</h2>

      <label>Fecha de inicio:</label>
      <input
        type="datetime-local"
        value={inicio}
        max={getLocalDateTime()}
        onChange={(e) => setInicio(e.target.value)}
      />


      <label>Fecha de fin:</label>
      <input
        type="datetime-local"
        value={fin}
        max={getLocalDateTime()}
        onChange={(e) => setFin(e.target.value)}
      />


      <button onClick={obtenerReporte}>Generar Reporte</button>

      {reporte && (
        <>
          {/* Renderizas la plantilla oculta */}
          <ReportePlantilla reporte={reporte} style={{ display: 'none' }} />

          {/* Botón para generar el PDF */}
          <button onClick={generarPDF} style={{ marginTop: '20px' }}>
            Descargar PDF
          </button>
        </>
      )}

    </div>
  );
};

export default PaginaReportes;
