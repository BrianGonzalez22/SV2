// BusquedaUsuarios.jsx
import React, { useState } from 'react';
import AxiosInstance from './axios';
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Alert,
  Container,
  Paper,
  Stack,
} from '@mui/material';

const BusquedaUsuarios = () => {
  const [nombre, setNombre] = useState('');
  const [matricula, setMatricula] = useState('');
  const [resultados, setResultados] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [errorBusqueda, setErrorBusqueda] = useState('');

  const buscarUsuarios = async () => {
    try {
      const res = await AxiosInstance.get('buscar-usuarios/', {
        params: { nombre, matricula },
      });
      if (Array.isArray(res.data) && res.data.length > 0) {
        setResultados(res.data);
        setErrorBusqueda('');
      } else {
        setResultados([]);
        setErrorBusqueda('No se encontraron usuarios.');
      }
    } catch (error) {
      console.error('Error en la búsqueda:', error);
      setResultados([]);
      setErrorBusqueda('Error al buscar usuarios.');
    }
  };

  const manejarSubmit = (e) => {
    e.preventDefault();
    buscarUsuarios();
  };

  const obtenerDetallesUsuario = async (id) => {
    try {
      const res = await AxiosInstance.get(`usuario/${id}/`);
      setUsuarioSeleccionado(res.data);
      setOpenDialog(true);
    } catch (error) {
      console.error('Error al obtener detalles del usuario:', error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Búsqueda de Usuarios
        </Typography>
        <Box component="form" onSubmit={manejarSubmit} sx={{ mb: 2 }}>
          <Stack spacing={2}>
            <TextField
              label="Nombre"
              variant="outlined"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              fullWidth
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
              label="Número de control (opcional)"
              variant="outlined"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
              fullWidth
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
            <Button type="submit" variant="contained" sx={{
              backgroundColor: '#32129a', // tu color personalizado
              '&:hover': {
                backgroundColor: '#5d3397', // color al hacer hover
              },
            }}>
              Buscar
            </Button>
          </Stack>
        </Box>

        {errorBusqueda && <Alert severity="info">{errorBusqueda}</Alert>}

        <List>
          {resultados.map((usuario) => (
            <ListItem
              button
              key={usuario.id}
              onClick={() => obtenerDetallesUsuario(usuario.id)}
            >
              <ListItemText
                primary={usuario.nombre}
                secondary={`Matrícula: ${usuario.matricula}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Detalles del Usuario</DialogTitle>
        <DialogContent>
          {usuarioSeleccionado && (
            <Stack spacing={1}>
              <Typography><strong>Nombre:</strong> {usuarioSeleccionado.nombre}</Typography>
              <Typography><strong>Correo:</strong> {usuarioSeleccionado.correo}</Typography>
              <Typography><strong>Teléfono:</strong> {usuarioSeleccionado.telefono}</Typography>
              <Typography><strong>Rol:</strong> {usuarioSeleccionado.rol}</Typography>
            </Stack>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default BusquedaUsuarios;
