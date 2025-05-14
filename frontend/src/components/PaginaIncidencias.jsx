import React, { useState } from 'react';
import AxiosInstance from './axios';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Button,
  Box,
} from '@mui/material';

const CrearIncidencia = () => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [tipo, setTipo] = useState('');
  const [motivo, setMotivo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const incidenciaData = {
      nombre_usuario: nombreUsuario,
      tipo: tipo,
      motivo: motivo,
    };

    AxiosInstance.post('incidencias/', incidenciaData)
      .then(response => {
        alert('Incidencia reportada con éxito');
        setNombreUsuario('');
        setTipo('');
        setMotivo('');
      })
      .catch(error => {
        console.error('Error al reportar incidencia:', error);
        alert('Error al reportar incidencia');
      });
  };

  return (
    <Box display="flex" justifyContent="center" mt={5}>
      <Card sx={{ width: 400, padding: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Reportar Incidencia
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Nombre del Usuario"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              fullWidth
              margin="normal"
              required
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
              label="Tipo de Incidencia"
              select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              fullWidth
              margin="normal"
              required
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
            >
              <MenuItem value="actividad_ilicita">Actividad Ilícita</MenuItem>
              <MenuItem value="falta_identificacion">Falta de Identificación</MenuItem>
              <MenuItem value="otro">Otro</MenuItem>
            </TextField>

            <TextField
              label="Motivo"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              fullWidth
              margin="normal"
              multiline
              rows={4}
              required
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

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2 ,
                    backgroundColor: '#32129a', // tu color personalizado
                    '&:hover': {
                    backgroundColor: '#5d3397', // color al hacer hover
              },}}
            >
              Reportar Incidencia
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CrearIncidencia;
