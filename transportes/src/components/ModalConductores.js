import {
    Box,
    Button, Checkbox,
    FormControlLabel,
    Grid,
    IconButton,
    MenuItem,
    Modal,
    Select,
    TextField,
    Typography
} from "@mui/material";
import React, {useState} from 'react';
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";

const ConductoresForm = ({isOpen, onClose, localidades}) => {
    const [conductor, setConductor] = useState({
        nombre: '',
        apellido: '',
        dni: '',
        localidad: '',
        telefono: '',
        direccion: '',
        es_particular: false,
        tarifa: '',
        camion_matricula: '',   // Nuevo campo para matrícula de camión
        camion_pesomaximo: ''   // Nuevo campo para peso máximo del camión
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
    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        setConductor((prevConductor) => ({
            ...prevConductor,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

   const handleSubmit = async (e) => {
    e.preventDefault();

    // Estructura de datos dividida en conductor y camionParticular
    const payload = {
        conductor: {
            nombre: conductor.nombre,
            apellido: conductor.apellido,
            dni: conductor.dni,
            localidad: conductor.localidad,
            telefono: conductor.telefono,
            direccion: conductor.direccion,
            es_particular: conductor.es_particular
        },
        camionParticular: conductor.es_particular ? {
            tarifa: conductor.tarifa,
            camion_matricula: conductor.camion_matricula,
            camion_pesomaximo: conductor.camion_pesomaximo
        } : null
    };

    try {
        const response = await fetch('http://localhost:8000/RedTransportes/api/conductores/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (response.ok) {

            Swal.fire({
                title: '¡Éxito!',
                text: 'El conductor se ha agregado exitosamente.',
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
            onClose();
            window.location.reload(); // Refresca la lista de conductores
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al agregar el conductor.',
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
    } catch (error) {
        console.error('Error en el envío:', error);
        Swal.fire({
            title: 'Error',
            text: 'Hubo un error inesperado al agregar el conductor.',
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
                    <CloseIcon/>
                </IconButton>
                <Grid container spacing={1} style={{marginTop: '10px'}}>
                    <TextField
                        label="DNI"
                        name="dni"
                        value={conductor.dni}
                        onChange={handleChange}
                        size="small"
                        sx={{margin: '10px'}}
                    />
                    <TextField
                        label="Nombre"
                        name="nombre"
                        value={conductor.nombre}
                        onChange={handleChange}
                        size="small"
                        sx={{margin: '10px'}}
                    /> <TextField
                    label="Apellido"
                    name="apellido"
                    value={conductor.apellido}
                    onChange={handleChange}
                    size="small"
                    sx={{margin: '10px'}}
                />
                    <Select
                        label="Localidad"
                        name="localidad"
                        value={conductor.localidad}
                        onChange={handleChange}
                        size="small"
                        displayEmpty
                        sx={{margin: '10px', minWidth: '200px'}}
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
                        sx={{margin: '10px'}}
                    />
                    <TextField
                        label="Direccion"
                        name="direccion"
                        value={conductor.direccion}
                        onChange={handleChange}
                        size="small"
                        sx={{margin: '10px'}}
                    />
                    {/* Checkbox para seleccionar si es particular */}
                    <FormControlLabel
                        control={<Checkbox checked={conductor.es_particular} onChange={handleChange}
                                           name="es_particular"/>}
                        label="¿Es particular?"
                    />

                    {conductor.es_particular && (
                        <>
                            <TextField
                                label="Tarifa"
                                name="tarifa"
                                value={conductor.tarifa}
                                onChange={handleChange}
                                size="small"
                                sx={{margin: '10px'}}
                            />
                            <TextField
                                label="Matrícula del Camión"
                                name="camion_matricula"
                                value={conductor.camion_matricula}
                                onChange={handleChange}
                                size="small"
                                sx={{margin: '10px'}}
                            />
                            <TextField
                                label="Peso Máximo del Camión"
                                name="camion_pesomaximo"
                                value={conductor.camion_pesomaximo}
                                onChange={handleChange}
                                size="small"
                                sx={{margin: '10px'}}
                                type="number"
                            />
                        </>
                    )}

                </Grid>
                <Button onClick={handleSubmit}>
                    Agregar
                </Button>
            </Box>
        </Modal>
    );
};

export default ConductoresForm;
