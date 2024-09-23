import {Box, Button, Grid, IconButton, MenuItem, Modal, Select, TextField, Typography} from "@mui/material";
import React, { useState } from 'react';
import CloseIcon from "@mui/icons-material/Close";

const ConductoresForm = ({ isOpen, onClose, localidades}) => {
    const [conductor, setConductor] = useState({
        nombre: '',
        apellido:'',
        dni: '',
        localidad: '',
        telefono: '',
        direccion: '',
        es_particular: '',
        camion: ''
    });

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: '500px',
        bgcolor: 'background.paper',
        borderRadius: '10px',
        boxShadow: 24,
        p: 2,
    };

    const closeButtonStyle = {
        position: 'absolute',
        right: '8px',
        top: '2px',
        color: 'grey',
    };

    // Función para manejar los cambios en los campos de texto
    const handleChange = (e) => {
        const { name, value } = e.target;
        setConductor((prevConductor) => ({
            ...prevConductor,
            [name]: value
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!conductor.nombre || !conductor.dni || !conductor.localidad || !conductor.telefono) {
            alert('Por favor, complete todos los campos obligatorios.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/RedTransportes/api/conductores/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(conductor),
            });

            if (!response.ok) {
                throw new Error('Error al enviar los datos.');
            }

            const data = await response.json();
            console.log('Respuesta del servidor:', data);

            // Cerrar el modal después de enviar
            onClose();
        } catch (error) {
            console.error('Error en el envío:', error);
        }
    };


    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box sx={style}>
                <Typography>Agregar un Conductor</Typography>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={closeButtonStyle}
                >
                    <CloseIcon />
                </IconButton>
                <Grid container spacing={1} style={{ marginTop: '10px' }}>
                    <TextField
                        label="DNI"
                        name="dni"
                        value={conductor.dni}
                        onChange={handleChange}
                        size="small"
                        sx={{ margin: '10px' }}
                    />
                    <TextField
                        label="Nombre"
                        name="nombre"
                        value={conductor.nombre}
                        onChange={handleChange}
                        size="small"
                        sx={{ margin: '10px' }}
                    /> <TextField
                        label="Apellido"
                        name="apellido"
                        value={conductor.apellido}
                        onChange={handleChange}
                        size="small"
                        sx={{ margin: '10px' }}
                    />
                   <Select
                        label="Localidad"
                        name="localidad"
                        value={conductor.localidad}
                        onChange={handleChange}
                        size="small"
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

                    <TextField
                        label="Telefono"
                        name="telefono"
                        value={conductor.telefono}
                        onChange={handleChange}
                        size="small"
                        sx={{ margin: '10px' }}
                    />
                    <TextField
                        label="Direccion"
                        name="direccion"
                        value={conductor.direccion}
                        onChange={handleChange}
                        size="small"
                        sx={{ margin: '10px' }}
                    />
                </Grid>
                <Button onClick={handleSubmit}>
                    Agregar
                </Button>
            </Box>
        </Modal>
    );
};

export default ConductoresForm;
