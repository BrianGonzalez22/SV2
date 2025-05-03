import React, { useState } from 'react';
import AxiosInstance from './axios';  // Asumiendo que tienes configurado Axios

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

    // Enviar los datos a la API de Django
    AxiosInstance.post('/api/incidencias/', incidenciaData)
      .then(response => {
        alert('Incidencia reportada con éxito');
      })
      .catch(error => {
        console.error('Error al reportar incidencia:', error);
        alert('Error al reportar incidencia');
      });
  };

  return (
    <div>
      <h2>Reportar Incidencia</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre del Usuario:</label>
          <input
            type="text"
            value={nombreUsuario}
            onChange={(e) => setNombreUsuario(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Tipo de Incidencia:</label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} required>
            <option value="actividad_ilicita">Actividad Ilícita</option>
            <option value="falta_identificacion">Falta de Identificación</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        <div>
          <label>Motivo:</label>
          <textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            required
          />
        </div>

        <button type="submit">Reportar Incidencia</button>
      </form>
    </div>
  );
};

export default CrearIncidencia;
