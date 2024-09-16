// src/components/ConductorList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Importaciones de Material-UI
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';


function ConductorList() {
  const [conductores, setConductores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);


const fetchConductores = async () => {
  try {
    const response = await axios.get('http://localhost:8000/RedTransportes/api/conductores/');
    console.log("Response", response)
    setConductores(response.data);
    setLoading(false);
  } catch (err) {
    console.error('Error al obtener los conductores:', err);
    setError(true);
    setLoading(false);
  }
};


  useEffect(() => {
    fetchConductores();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <CircularProgress />
        <Typography>Cargando conductores...</Typography>
      </div>
    );
  }

  if (error) {
    return (
      <Alert severity="error">Hubo un error al cargar los conductores.</Alert>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" gutterBottom component="div" style={{ padding: '1rem' }}>
        Lista de Conductores
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>ID</strong></TableCell>
            <TableCell><strong>Nombre</strong></TableCell>
            <TableCell><strong>DNI</strong></TableCell>
            <TableCell><strong>Dirección</strong></TableCell>
            <TableCell><strong>Teléfono</strong></TableCell>
            <TableCell><strong>Localidad</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {conductores.map((conductor) => (
            <TableRow key={conductor.id}>
              <TableCell>{conductor.id}</TableCell>
              <TableCell>{conductor.nombre}</TableCell>
              <TableCell>{conductor.dni}</TableCell>
              <TableCell>{conductor.direccion}</TableCell>
              <TableCell>{conductor.telefono}</TableCell>
              <TableCell>{conductor.localidad_nombre}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ConductorList;
