// BusquedaUsuarios.jsx
import React, { useState } from 'react';
import AxiosInstance from './axios';

const BusquedaUsuarios = () => {
  const [nombre, setNombre] = useState('');
  const [matricula, setMatricula] = useState('');
  const [resultados, setResultados] = useState([]);

  const buscarUsuarios = async () => {
    try {
      const res = await AxiosInstance.get('api/buscar-usuarios/', {
        params: {
          nombre,
          matricula
        }
      });
      console.log('Respuesta del servidor:', res.data); // 👈 esto es clave
      setResultados(res.data);
    } catch (error) {
      console.error('Error en la búsqueda:', error);
      setResultados([]); // para evitar que quede en estado inválido
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
          placeholder="Numero de control (opcional)"
          value={matricula}
          onChange={(e) => setMatricula(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>

      <ul>
        {Array.isArray(resultados) ? (
            resultados.map((usuario) => (
            <li key={usuario.id}>
                {usuario.nombre} - {usuario.matricula}
            </li>
            ))
        ) : (
            <li>No hay resultados válidos</li>
        )}
      </ul>

    </div>
  );
};

export default BusquedaUsuarios;
