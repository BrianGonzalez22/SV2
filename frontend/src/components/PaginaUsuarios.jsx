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
  Typography
} from '@mui/material';


const BusquedaUsuarios = () => {
  const [nombre, setNombre] = useState('');
  const [matricula, setMatricula] = useState('');
  const [resultados, setResultados] = useState([]);
  const [mensaje, setMensaje] = useState('');

  const buscarUsuarios = async () => {
    try {
      // Si no hay ningún campo lleno, evitar búsqueda
      if (!nombre.trim() && !matricula.trim()) {
        setMensaje('Ingresa al menos un campo para buscar.');
        setResultados([]);
        return;
      }

      const res = await AxiosInstance.get('api/buscar-usuarios/', {
        params: {
          nombre,
          matricula
        }
      });

      console.log('Respuesta del servidor:', res.data);

      if (res.data.length === 0) {
        setMensaje('No se encontró ningún usuario con esos datos.');
      } else {
        setMensaje(''); // Limpiar mensaje si hay resultados
      }

      setResultados(res.data);

    } catch (error) {
      console.error('Error en la búsqueda:', error);
      setMensaje('Ocurrió un error al realizar la búsqueda.');
      setResultados([]);
    }
  };

  const manejarSubmit = (e) => {
    e.preventDefault();
    buscarUsuarios();
  };

  return (
    <div>
      <h2>Búsqueda de Usuarios</h2>
      <form onSubmit={manejarSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="text"
          placeholder="Número de control (opcional)"
          value={matricula}
          onChange={(e) => setMatricula(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>

      {/* Mostrar mensaje si existe */}
      {mensaje && <div style={{ color: 'red', marginTop: '10px' }}>{mensaje}</div>}

      {/* Lista de resultados */}
      <ul>
        {resultados.map((usuario) => (
          <li key={usuario.id}>
            {usuario.nombre} - {usuario.matricula}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BusquedaUsuarios;
