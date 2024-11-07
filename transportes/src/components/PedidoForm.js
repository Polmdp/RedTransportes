import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Grid,
    Paper,
    Autocomplete,
    IconButton,
    Snackbar,
    Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import CrearClienteModal from './ClienteModal';

const PedidoForm = () => {
    const [clientes, setClientes] = useState([]);
    const [localidades, setLocalidades] = useState([]);
    const [pedido, setPedido] = useState({
        cliente: null,
        paquetes: [{ peso: '', tamaño: '', localidad_fin: null }],
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });
    const [openModal, setOpenModal] = useState(false); // Control para abrir el modal

    useEffect(() => {
        fetchClientes();
        fetchLocalidades();
    }, []);

    const fetchClientes = async () => {
        try {
            const response = await axios.get('http://localhost:8000/RedTransportes/api/clientes/');
            setClientes(response.data);
        } catch (error) {
            console.error('Error fetching clientes:', error);
        }
    };

    const fetchLocalidades = async () => {
        try {
            const response = await axios.get('http://localhost:8000/RedTransportes/api/localidades/');
            setLocalidades(response.data);
        } catch (error) {
            console.error('Error fetching localidades:', error);
        }
    };

    const handleClienteChange = (event, newValue) => {
        setPedido({ ...pedido, cliente: newValue });
    };

    const handlePaqueteChange = (index, field, value) => {
        const newPaquetes = [...pedido.paquetes];
        newPaquetes[index][field] = value;
        setPedido({ ...pedido, paquetes: newPaquetes });
    };

    const addPaquete = () => {
        setPedido({
            ...pedido,
            paquetes: [...pedido.paquetes, { peso: '', tamaño: '', localidad_fin: null }],
        });
    };

    const removePaquete = (index) => {
        const newPaquetes = pedido.paquetes.filter((_, i) => i !== index);
        setPedido({ ...pedido, paquetes: newPaquetes });
    };

   const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        const pedidoData = {
            cliente: pedido.cliente ? pedido.cliente.id : null,
            paquetes: pedido.paquetes.map(paquete => ({
                peso: paquete.peso,
                tamaño: paquete.tamaño,
                localidad_fin: paquete.localidad_fin ? paquete.localidad_fin.id : null,
            })),
        };
        const response = await axios.post('http://localhost:8000/RedTransportes/api/pedidos/', pedidoData);

        const precioTotal = response.data.precio_total.total_price;
        const descuentoAplicado = response.data.precio_total.descuento_aplicado;

        setSnackbar({
            open: true,
            message: `Pedido creado con éxito. Precio total: $${precioTotal.toFixed(2)}${descuentoAplicado ? ' (se aplicó el 2x1)' : ''}`,
            severity: 'success',
        });

        setPedido({
            cliente: null,
            paquetes: [{ peso: '', tamaño: '', localidad_fin: null }],
        });
    } catch (error) {
        console.error('Error al crear el pedido:', error);
        setSnackbar({
            open: true,
            message: 'Error al crear el pedido. Por favor, intente nuevamente.',
            severity: 'error',
        });
    }
};


    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    const openCreateClienteModal = () => setOpenModal(true);
    const closeCreateClienteModal = () => setOpenModal(false);

    return (
        <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Crear Nuevo Pedido
            </Typography>
            <Button variant="outlined" color="primary" onClick={openCreateClienteModal} startIcon={<AddIcon />}>
                Crear Cliente
            </Button>

            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Autocomplete
                            options={clientes}
                            getOptionLabel={(option) => `${option.nombre} ${option.apellido}`}
                            renderInput={(params) => <TextField {...params} label="Cliente" required />}
                            value={pedido.cliente}
                            onChange={handleClienteChange}
                        />
                    </Grid>

                    {pedido.paquetes.map((paquete, index) => (
                        <Grid item xs={12} key={index}>
                            <Paper elevation={2} sx={{ p: 2, position: 'relative' }}>
                                <Typography variant="h6" gutterBottom>
                                    Paquete {index + 1}
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="Peso"
                                            type="number"
                                            value={paquete.peso}
                                            onChange={(e) => handlePaqueteChange(index, 'peso', e.target.value)}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="Tamaño"
                                            type="number"
                                            value={paquete.tamaño}
                                            onChange={(e) => handlePaqueteChange(index, 'tamaño', e.target.value)}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Autocomplete
                                            options={localidades}
                                            getOptionLabel={(option) => option.nombre}
                                            renderInput={(params) => <TextField {...params} label="Localidad de destino" required />}
                                            value={paquete.localidad_fin}
                                            onChange={(event, newValue) => handlePaqueteChange(index, 'localidad_fin', newValue)}
                                        />
                                    </Grid>
                                </Grid>
                                {index > 0 && (
                                    <IconButton
                                        aria-label="delete"
                                        onClick={() => removePaquete(index)}
                                        sx={{ position: 'absolute', top: 8, right: 8 }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                )}
                            </Paper>
                        </Grid>
                    ))}

                    <Grid item xs={12}>
                        <Button startIcon={<AddIcon />} onClick={addPaquete}>
                            Añadir Paquete
                        </Button>
                    </Grid>

                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary">
                            Crear Pedido
                        </Button>
                    </Grid>
                </Grid>
            </form>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* Modal para crear cliente */}
            <CrearClienteModal open={openModal} onClose={closeCreateClienteModal} fetchClientes={fetchClientes} localidades={localidades}/>
        </Paper>
    );
};

export default PedidoForm;
