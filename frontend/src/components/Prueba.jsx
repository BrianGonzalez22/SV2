import React, { useEffect, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

const MensajesSocket = () => {
  const [mensajes, setMensajes] = useState([]);
  const [alerta, setAlerta] = useState({ open: false, mensaje: '' });

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8000/ws/mensajes/');

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMensajes(prev => [...prev, data.message]);
      setAlerta({ open: true, mensaje: `Nuevo mensaje: "${data.message}"` });
    };

    return () => socket.close();
  }, []);

  const handleClose = () => {
    setAlerta({ ...alerta, open: false });
  };

  return (
    <div>
      <h3>Mensajes en tiempo real:</h3>
      <ul>
        {mensajes.map((msg, i) => <li key={i}>{msg}</li>)}
      </ul>

      <Snackbar
        open={alerta.open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
          {alerta.mensaje}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MensajesSocket;
