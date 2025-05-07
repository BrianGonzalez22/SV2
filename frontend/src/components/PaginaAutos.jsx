import React, { useState } from "react";
import AxiosInstance from "./axios";
import {
  Container, TextField, Button, Typography, Paper, Box, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions
} from "@mui/material";

const PaginaAutos = () => {
  const [matricula, setMatricula] = useState("");
  const [auto, setAuto] = useState(null);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleInputChange = (event) => {
    setMatricula(event.target.value);
  };

  const handleBuscar = async () => {
    if (!matricula.trim()) {
      setError("Por favor, ingresa una matrícula.");
      return;
    }

    try {
      const response = await AxiosInstance.get(`autos/${matricula.trim()}`);
      if (response.data) {
        setAuto(response.data);
        setError("");
        setDialogOpen(true);
      } else {
        setAuto(null);
        setError("No se encontró automovil con la matrícula introducida.");
      }
    } catch (err) {
      console.error("Error al buscar el auto:", err);
      setError("Ocurrió un error al realizar la búsqueda.");
      setAuto(null);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Typography variant="h5" gutterBottom>
          Búsqueda de Vehículos
        </Typography>
        <Box display="flex" gap={2} alignItems="center">
          <TextField
            label="Matrícula"
            variant="outlined"
            fullWidth
            value={matricula}
            onChange={handleInputChange}
          />
          <Button variant="contained" color="primary" onClick={handleBuscar}>
            Buscar
          </Button>
        </Box>

        {error && (
          <Typography color="error" sx={{ marginTop: 2 }}>
            {error}
          </Typography>
        )}
      </Paper>

      {/* Detalle en diálogo */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Detalles del Vehículo</DialogTitle>
        <DialogContent>
          {auto ? (
            <>
              <DialogContentText><strong>Placa:</strong> {auto.placa}</DialogContentText>
              <DialogContentText><strong>Modelo:</strong> {auto.modelo}</DialogContentText>
              <DialogContentText><strong>Color:</strong> {auto.color}</DialogContentText>
              <DialogContentText><strong>Tipo:</strong> {auto.tipo}</DialogContentText>
              <DialogContentText><strong>Responsable:</strong> {auto.usuario}</DialogContentText>
            </>
          ) : (
            <DialogContentText>No hay información del vehículo.</DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PaginaAutos;
