import {Box, Grid, IconButton, Modal, TextField, Typography} from "@mui/material";
import React, {useEffect, useState} from 'react';
import CloseIcon from "@mui/icons-material/Close";

const ConductoresForm = ({isOpen, onClose}) => {
    const[conductor, setConductor]=useState([{
        nombre:'',
        dni:'',
        localidad:'',
        telefono:'',
        direccion:'',
        es_particular:'',
        camion:''
    }])
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
                <Grid container spacing={1} style={{marginTop:'10px'}}>
                <TextField label="DNI" size="small" sx={{margin:'10px'}} > DNI </TextField>
                <TextField label="Nombre" size="small" sx={{margin:'10px'}}> Nombre </TextField>
                <TextField label="Localidad" size="small"sx={{margin:'10px'}} > Localidad </TextField>
                <TextField label="Telefono" size="small" sx={{margin:'10px'}}> Telefono </TextField>
                <TextField label="Direccion" size="small" sx={{margin:'10px'}}> Direccion </TextField>
                    </Grid>
            </Box>
        </Modal>
    );
};
export default ConductoresForm;