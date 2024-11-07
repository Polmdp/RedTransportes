import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, Autocomplete, Grid } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2'; // Importando SweetAlert2

const ClienteModal = ({ open, onClose, fetchClientes, localidades }) => {
    const [cliente, setCliente] = useState({
        dni: '',
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        direccion: '',  // Agregado el campo direccion
        localidad: null, // Localidad seleccionada
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCliente((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!cliente.dni || !cliente.nombre || !cliente.apellido || !cliente.email || !cliente.telefono || !cliente.direccion || !cliente.localidad) {
        Swal.fire({
            title: 'Campos obligatorios faltantes',
            text: 'Por favor complete todos los campos obligatorios.',
            icon: 'warning',
            confirmButtonText: 'Aceptar',
            didOpen: () => {
                // Cambia el z-index para asegurarse de que esté encima del modal
                const swalContainer = document.querySelector('.swal2-container');
                if (swalContainer) {
                    swalContainer.style.zIndex = '9999'; // Aseguramos que esté por encima
                }
            }
        });
        return; // No enviamos la solicitud si hay campos vacíos
    }
        try {
            const response = await axios.post('http://localhost:8000/RedTransportes/api/clientes/', {
                ...cliente,
                localidad: cliente.localidad ? cliente.localidad.id : null, // Aseguramos que mandamos el ID de la localidad
            });
            fetchClientes(); // Refresca la lista de clientes
            onClose(); // Cierra el modal

            // SweetAlert2 - Mensaje de éxito
            Swal.fire({
                title: '¡Éxito!',
                text: 'Cliente creado correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar',
                didOpen: () => {
                // Cambia el z-index para asegurarse de que esté encima del modal
                const swalContainer = document.querySelector('.swal2-container');
                if (swalContainer) {
                    swalContainer.style.zIndex = '9999'; // Aseguramos que esté por encima
                }
            }
            });
             setCliente({
            dni: '',
            nombre: '',
            apellido: '',
            email: '',
            telefono: '',
            direccion: '',
            localidad: null,
        });


        } catch (error) {
            console.error('Error al crear cliente:', error);

            if (error.response) {
                // SweetAlert2 - Mensaje de error
                Swal.fire({
                    title: 'Error',
                    text: 'El cliente con ese dni ya existe',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    didOpen: () => {
                // Cambia el z-index para asegurarse de que esté encima del modal
                const swalContainer = document.querySelector('.swal2-container');
                if (swalContainer) {
                    swalContainer.style.zIndex = '9999'; // Aseguramos que esté por encima
                }
            }
                });
            }
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ width: 450, margin: 'auto', padding: 2, bgcolor: 'background.paper', borderRadius: 2, mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Crear Cliente
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            label="DNI"
                            name="dni"
                            value={cliente.dni}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Teléfono"
                            name="telefono"
                            value={cliente.telefono}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Nombre"
                            name="nombre"
                            value={cliente.nombre}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Apellido"
                            name="apellido"
                            value={cliente.apellido}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Email"
                            name="email"
                            value={cliente.email}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Dirección"
                            name="direccion"
                            value={cliente.direccion}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Autocomplete
                            options={localidades}
                            getOptionLabel={(option) => option.nombre}
                            value={cliente.localidad}
                            onChange={(event, newValue) => setCliente((prev) => ({ ...prev, localidad: newValue }))}
                            renderInput={(params) => <TextField {...params} label="Localidad" />}
                            fullWidth
                            margin="normal"
                            required
                        />
                    </Grid>
                </Grid>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Guardar Cliente
                </Button>
            </Box>
        </Modal>
    );
};

export default ClienteModal;
