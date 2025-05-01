import { React, useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Typography, Grid } from '@mui/material';
import TablaDatos from './tabladatos';
import AxiosInstance from './axios';

const PaginaRegistros = () => {
  const [registros, setRegistros] = useState([]);
  const [columnasDinamicas, setColumnasDinamicas] = useState([]);

  const [anioSeleccionado, setAnioSeleccionado] = useState('');
  const [mesSeleccionado, setMesSeleccionado] = useState('');
  // Cambios en el estado
  const [diasDisponibles, setDiasDisponibles] = useState([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState('');

  const [fechaSeleccionada, setFechaSeleccionada] = useState('');


  const listaAnios = ['2023', '2024', '2025'];
  const listaMeses = [
    { nombre: 'Enero', valor: 1 },
    { nombre: 'Febrero', valor: 2 },
    { nombre: 'Marzo', valor: 3 },
    { nombre: 'Abril', valor: 4 },
    { nombre: 'Mayo', valor: 5 },
    { nombre: 'Junio', valor: 6 },
    { nombre: 'Julio', valor: 7 },
    { nombre: 'Agosto', valor: 8 },
    { nombre: 'Septiembre', valor: 9 },
    { nombre: 'Octubre', valor: 10 },
    { nombre: 'Noviembre', valor: 11 },
    { nombre: 'Diciembre', valor: 12 }
  ];

  useEffect(() => {
    if (anioSeleccionado && mesSeleccionado) {
      AxiosInstance.get('obtener-fechas-registros/', {
        params: {
          anio: anioSeleccionado,
          mes: mesSeleccionado
        }
      })
        .then(response => {
          const dias = response.data;  // La respuesta ya es un array de días (1, 2, 3,...)
          console.log("Días disponibles:", dias); // Verifica los días recibidos
          setDiasDisponibles(dias);  // Directamente setea los días
          setDiaSeleccionado(''); // Reinicia el día seleccionado
          setFechaSeleccionada(''); // Reinicia la fecha seleccionada
        })
        .catch(error => {
          console.error('Error al obtener los días disponibles:', error);
        });
    }
  }, [anioSeleccionado, mesSeleccionado]);
  
  

  useEffect(() => {
    if (anioSeleccionado && mesSeleccionado && diaSeleccionado) {
      const fecha = `${anioSeleccionado}-${mesSeleccionado.toString().padStart(2, '0')}-${diaSeleccionado
        .toString()
        .padStart(2, '0')}`;
      setFechaSeleccionada(fecha);
    }
  }, [anioSeleccionado, mesSeleccionado, diaSeleccionado]);
  

  // Definir las columnas dinámicamente
  useEffect(() => {
    if (registros.length > 0) {
      const columnas = Object.keys(registros[0]).map(key => ({
        field: key,
        headerName: key.charAt(0).toUpperCase() + key.slice(1),
        width: 150
      }));
      setColumnasDinamicas(columnas);
    } else {
      setColumnasDinamicas([]);
    }
  }, [registros]);


  useEffect(() => {
    if (fechaSeleccionada) {
      const inicioFecha = `${fechaSeleccionada}T00:00:00`;
      const finFecha = `${fechaSeleccionada}T23:59:59`;
  
      AxiosInstance.get(`obtener-fechas-filtradas/`, {
        params: {
          fecha_inicio: inicioFecha,
          fecha_fin: finFecha
        }
      })
        .then(response => setRegistros(response.data))
        .catch(error => console.error('Error al obtener los registros filtrados:', error));
    }
  }, [fechaSeleccionada]);
  
  return (
    <div style={{ padding: '2rem' }}>
      <Typography variant="h4">Registros del Estacionamiento</Typography>

      <Grid container spacing={2} style={{ marginTop: '1rem' }}>
        <Grid item xs={4}>
          <FormControl fullWidth>
            <InputLabel id="anio-label">Año</InputLabel>
            <Select
              labelId="anio-label"
              value={anioSeleccionado}
              label="Año"
              onChange={(e) => setAnioSeleccionado(e.target.value)}
            >
              {listaAnios.map((anio) => (
                <MenuItem key={anio} value={anio}>
                  {anio}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={4}>
          <FormControl fullWidth>
            <InputLabel id="mes-label">Mes</InputLabel>
            <Select
              labelId="mes-label"
              value={mesSeleccionado}
              label="Mes"
              onChange={(e) => setMesSeleccionado(e.target.value)}
            >
              {listaMeses.map((mes) => (
                <MenuItem key={mes.valor} value={mes.valor}>
                  {mes.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={4}>
          <FormControl fullWidth>
            <InputLabel id="dia-label">Día</InputLabel>
            <Select
              labelId="dia-label"
              value={diaSeleccionado}
              label="Día"
              onChange={(e) => setDiaSeleccionado(e.target.value)}
              disabled={!diasDisponibles.length}
            >
              {diasDisponibles.map((dia) => (
                <MenuItem key={dia} value={dia}>
                  {dia}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <TablaDatos datos={registros} columnas={columnasDinamicas} />
    </div>
  );
};

export default PaginaRegistros;
