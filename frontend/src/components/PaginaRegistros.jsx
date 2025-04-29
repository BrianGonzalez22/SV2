import { React, useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';
import TablaDatos from './tabladatos';
import AxiosInstance from './axios';

const PaginaRegistros = () => {

  const [registros, setRegistros] = useState([]);
  const [columnasDinamicas, setColumnasDinamicas] = useState([]);
  const [fechasDisponibles, setFechasDisponibles] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');

  // Obtener las fechas disponibles
  useEffect(() => {
    AxiosInstance.get('obtener-fechas-registros/')
      .then(response => {
        const fechasFormateadas = response.data.map(fecha => {
          const date = new Date(fecha);
          return `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}-${date.getUTCDate().toString().padStart(2, '0')}`;
        });
        setFechasDisponibles(fechasFormateadas);
      })
      .catch(error => {
        console.error('Error al obtener las fechas:', error);
      });
  }, []);

  // Obtener los registros filtrados por fecha seleccionada
  useEffect(() => {
    if (fechaSeleccionada) {
      const inicioFecha = `${fechaSeleccionada}T00:00:00`;
      const finFecha = `${fechaSeleccionada}T23:59:59`;

      AxiosInstance.get(`obtener-fechas-filtradas/?fecha_inicio=${inicioFecha}&fecha_fin=${finFecha}`)
        .then(response => {
          setRegistros(response.data);
        })
        .catch(error => {
          console.error('Error al obtener los registros filtrados:', error);
        });
    }
  }, [fechaSeleccionada]);

  // Definir las columnas dinámicamente
  useEffect(() => {
    if (registros.length > 0) {
      const columnas = Object.keys(registros[0]).map(key => ({
        field: key,
        headerName: key.charAt(0).toUpperCase() + key.slice(1),
        width: 150,
      }));
      setColumnasDinamicas(columnas);
    } else {
      setColumnasDinamicas([]);
    }
  }, [registros]);

  return (
    <div style={{ padding: '2rem' }}>
      <Typography variant="h4">Registros del Estacionamiento</Typography>

      <FormControl fullWidth style={{ marginTop: '1rem' }}>
        <InputLabel id="fecha-label">Selecciona una fecha</InputLabel>
        <Select
          labelId="fecha-label"
          value={fechaSeleccionada}
          label="Selecciona una fecha"
          onChange={(e) => setFechaSeleccionada(e.target.value)}
        >
          {fechasDisponibles.map((fecha, index) => (
            <MenuItem key={index} value={fecha}>
              {fecha}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TablaDatos datos={registros} columnas={columnasDinamicas} />
    </div>
  );
};

export default PaginaRegistros;
