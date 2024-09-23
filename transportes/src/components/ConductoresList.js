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
  Alert, Button, Grid,
} from '@mui/material';
import ModalConductores from './ModalConductores'

function ConductorList() {
  const [conductores, setConductores] = useState([]);
  const [localidades, setLocalidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [openModalConductores,setOpenModalConductores]=useState(false)
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
  const fetchLocalidades = async () => {
  try {
    const response = await axios.get('http://localhost:8000/RedTransportes/api/localidades/');
    console.log("Response", response)
    setLocalidades(response.data);
    console.log(response.data)
  } catch (err) {
    console.error('Error al obtener los conductores:', err);
    setError(true);
  }
};
const handleClickAgregar=()=>{
  setOpenModalConductores(true)
}
const handleCloseAgregar=()=>{
  setOpenModalConductores(false)
}

  useEffect(() => {
    fetchConductores();
    fetchLocalidades();
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
      <Button onClick={handleClickAgregar} sx={{marginTop:'10px',marginLeft:'10px'}}  variant="contained"
        color="primary">Agregar Conductor</Button>
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
{openModalConductores &&(
        <ModalConductores
        isOpen={openModalConductores}
        onClose={handleCloseAgregar}
        localidades={localidades}
      />)}
    </TableContainer>
  );

}

export default ConductorList;
