import React, { useState } from 'react';
import AxiosInstance from './axios';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
} from '@mui/material';
import ReportePlantilla from './PlantillaReporte';

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
    const canvas = await html2canvas(input, {
      logging: false,
    });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('reporte.pdf');
  };

  const getLocalDateTime = () => {
    const now = new Date();
    now.setSeconds(0, 0);
    const offset = now.getTimezoneOffset();
    const localTime = new Date(now.getTime() - offset * 60000);
    return localTime.toISOString().slice(0, 16);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Generar Reporte
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Fecha de inicio"
          type="datetime-local"
          value={inicio}
          InputLabelProps={{ shrink: true }}
          inputProps={{ max: getLocalDateTime() }}
          onChange={(e) => setInicio(e.target.value)}
          sx={{
                '& label.Mui-focused': {
                  color: '#32129a', // color del label al enfocar
                },
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#32129a', // color del borde al enfocar
                  },
                },
              }}
        />

        <TextField
          label="Fecha de fin"
          type="datetime-local"
          value={fin}
          InputLabelProps={{ shrink: true }}
          inputProps={{ max: getLocalDateTime() }}
          onChange={(e) => setFin(e.target.value)}
          sx={{
                '& label.Mui-focused': {
                  color: '#32129a', // color del label al enfocar
                },
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#32129a', // color del borde al enfocar
                  },
                },
              }}
        />

        <Button variant="contained" color="primary" onClick={obtenerReporte} sx={{
              backgroundColor: '#32129a', // tu color personalizado
              '&:hover': {
                backgroundColor: '#5d3397', // color al hacer hover
              },
            }}>
          Generar Reporte
        </Button>

        {reporte && (
          <>
            <div id="reporte-pdf" style={{ position: 'absolute', left: '-9999px', top: 0 }}>
              <ReportePlantilla reporte={reporte} />
            </div>


            <Button
              variant="outlined"
              color="secondary"
              onClick={generarPDF}
              sx={{ mt: 2 }}
            >
              Descargar PDF
            </Button>
          </>
        )}
      </Box>
    </Paper>
  );
};

export default PaginaReportes;
