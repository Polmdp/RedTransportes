import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, Paper, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton, MenuItem, Select
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import Swal from 'sweetalert2';

const ClientesList = () => {
    const [clientes, setClientes] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingCliente, setEditingCliente] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        dni: '',
        email: '',
        telefono: '',
        localidad: '',
        direccion: ''
    });
    const [localidades, setLocalidades] = useState([]);

    // Función para obtener la lista de clientes
    const fetchClientes = async () => {
        const response = await axios.get('http://localhost:8000/RedTransportes/api/clientes/');
        setClientes(response.data);
    };
    const fetchLocalidades = async () => {
        try {
            const response = await axios.get('http://localhost:8000/RedTransportes/api/localidades/');
            setLocalidades(response.data);
        } catch (error) {
            console.error('Error fetching localidades:', error);
        }
    };
    useEffect(() => {
        fetchClientes();
        fetchLocalidades();
    }, []);

    // Manejo de apertura y cierre del modal
    const handleClickOpen = (cliente = null) => {
        setEditingCliente(cliente);
        setFormData(cliente ? cliente : {
            nombre: '',
            apellido: '',
            dni: '',
            email: '',
            telefono: '',
            localidad: '',
            direccion: ''
        });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingCliente(null);
    };

    // Manejo del formulario
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Agregar o editar cliente
    const handleSave = async () => {
        const isEditing = !!editingCliente;

        if (isEditing) {
            await axios.put(`http://localhost:8000/RedTransportes/api/clientes/${editingCliente.id}/`, formData);
            Swal.fire({
                title: 'Cliente Editado',
                text: 'El cliente ha sido actualizado exitosamente.',
                icon: 'success',
                didOpen: () => {
                    const swalContainer = document.querySelector('.swal2-container');
                    if (swalContainer) {
                        swalContainer.style.zIndex = '9999';
                    }
                }
            });
        } else {
            await axios.post('http://localhost:8000/RedTransportes/api/clientes/', formData);
            Swal.fire({
                title: 'Cliente Agregado',
                text: 'El cliente ha sido agregado exitosamente.',
                icon: 'success',
                didOpen: () => {
                    const swalContainer = document.querySelector('.swal2-container');
                    if (swalContainer) {
                        swalContainer.style.zIndex = '9999';
                    }
                }
            });
        }
        fetchClientes();
        handleClose();
    };

    // Eliminar cliente con confirmación de SweetAlert
    const handleDelete = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'No podrás revertir esta acción.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            didOpen: () => {
                const swalContainer = document.querySelector('.swal2-container');
                if (swalContainer) {
                    swalContainer.style.zIndex = '9999';
                }
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.delete(`http://localhost:8000/RedTransportes/api/clientes/${id}/`);
                Swal.fire({
                    title: 'Cliente Eliminado',
                    text: 'El cliente ha sido eliminado exitosamente.',
                    icon: 'success',
                    didOpen: () => {
                        const swalContainer = document.querySelector('.swal2-container');
                        if (swalContainer) {
                            swalContainer.style.zIndex = '9999';
                        }
                    }
                });
                fetchClientes();
            }
        });
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Lista de Clientes
            </Typography>
            <Button variant="contained" color="primary" onClick={() => handleClickOpen()}>
                Agregar Cliente
            </Button>

            {/* Tabla de clientes */}
            <TableContainer component={Paper} sx={{ mt: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Apellido</TableCell>
                            <TableCell>Dni</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Teléfono</TableCell>
                            <TableCell>Localidad</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {clientes.map((cliente) => (
                            <TableRow key={cliente.id}>
                                <TableCell>{cliente.nombre}</TableCell>
                                <TableCell>{cliente.apellido}</TableCell>
                                <TableCell>{cliente.dni}</TableCell>
                                <TableCell>{cliente.email}</TableCell>
                                <TableCell>{cliente.telefono}</TableCell>
                                <TableCell>{cliente.localidad_nombre}</TableCell>
                                <TableCell>
                                    <IconButton color="primary" onClick={() => handleClickOpen(cliente)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="secondary" onClick={() => handleDelete(cliente.id)}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Modal para agregar o editar cliente */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editingCliente ? "Editar Cliente" : "Agregar Cliente"}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Apellido"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Dni"
                        name="dni"
                        value={formData.dni}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Telefono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Direccion"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleChange}
                        fullWidth
                    />
                    <Select
                        label="Localidad"
                        name="localidad"
                        value={formData.localidad}
                        onChange={handleChange}
                        displayEmpty
                        sx={{ margin: '10px', minWidth: '200px' }}
                    >
                        <MenuItem value="" disabled>Seleccione una localidad</MenuItem>
                        {localidades.map((localidad, index) => (
                            <MenuItem key={index} value={localidad.id}>
                                {localidad.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        {editingCliente ? "Guardar Cambios" : "Agregar"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ClientesList;
