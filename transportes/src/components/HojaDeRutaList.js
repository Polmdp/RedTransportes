import axios from "axios";
import React, {useEffect, useState} from "react";
import dayjs from 'dayjs';
import {
    Box, Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    Chip,
    Divider,
    Container
} from "@mui/material";
import {LocalizationProvider} from '@mui/x-date-pickers';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import PedidoDetailModal from "./PedidoDetailModal";

function ConductorList() {
    const [hojasDeRuta, setHojasDeRuta] = useState([]);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [selectedPedido, setSelectedPedido] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const fetchHojaDeRuta = async () => {
        try {
            const response = await axios.get('http://localhost:8000/RedTransportes/api/hojaderuta/');
            setHojasDeRuta(response.data);
        } catch (err) {
            console.error('Error al obtener las hoja de ruta:', err);
        }
    };

    const formatDate = (dateString) => {
        return dayjs(dateString).format("DD-MM-YYYY");
    };

    useEffect(() => {
        fetchHojaDeRuta();
    }, []);

    const filteredHojasDeRuta = hojasDeRuta.filter(hoja =>
        dayjs(hoja.fecha_destino).isSame(selectedDate, 'day')
    );

    const handlePedidoClick = (pedido) => {
        setSelectedPedido(pedido);
        setModalOpen(true);
    };

    return (
        <Container maxWidth="xl">
            <Box sx={{ my: 4 }}>
                <Paper sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        Hojas de Ruta
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Seleccionar Fecha"
                            value={selectedDate}
                            onChange={(newDate) => setSelectedDate(newDate)}
                            renderInput={(params) => <TextField {...params} />}
                            sx={{ width: '100%', maxWidth: 300 }}
                        />
                    </LocalizationProvider>
                </Paper>

                {filteredHojasDeRuta.length > 0 ? (
                    filteredHojasDeRuta.map((hoja) => (
                        <Paper
                            key={hoja.id}
                            sx={{
                                p: 3,
                                mb: 4,
                                border: '1px solid #e0e0e0',
                                borderRadius: 2,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                        >
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h5" color="primary" gutterBottom>
                                    Hoja de Ruta #{hoja.id}
                                </Typography>
                                <Typography variant="h6" gutterBottom>
                                    {hoja.ruta.localidad_inicio.nombre} → {hoja.ruta.localidad_fin.nombre}
                                </Typography>

                                <Divider sx={{ my: 2 }}/>

                                <Box sx={{ my: 2 }}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Localidades Intermedias:
                                    </Typography>
                                    <Box display="flex" flexWrap="wrap" gap={1}>
                                        {hoja.ruta.localidades_intermedias.map((loc) => (
                                            <Chip
                                                key={loc.id}
                                                label={loc.nombre}
                                                sx={{
                                                    backgroundColor: '#0569cb',
                                                    color: '#fff'
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </Box>

                                <Box sx={{ my: 2 }}>
                                    <Typography>
                                        <strong>Fecha de Despacho:</strong> {formatDate(hoja.fecha_partida)}
                                    </Typography>
                                    <Typography>
                                        <strong>Fecha de Llegada:</strong> {formatDate(hoja.fecha_destino)}
                                    </Typography>
                                    <Typography>
                                        <strong>Conductor:</strong> {hoja.conductor.nombre_completo} (ID: {hoja.conductor.id})
                                    </Typography>
                                </Box>
                            </Box>

                            <Typography variant="h6" gutterBottom>
                                Pedidos Asociados
                            </Typography>
                            <TableContainer component={Paper} variant="outlined">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><strong>ID</strong></TableCell>
                                            <TableCell><strong>Fecha</strong></TableCell>
                                            <TableCell><strong>Cliente</strong></TableCell>
                                            <TableCell><strong>Precio Total</strong></TableCell>
                                            <TableCell><strong>Destinos</strong></TableCell>
                                            <TableCell><strong>Acciones</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {hoja.pedidos.map((pedido) => (
                                            <TableRow key={pedido.id}>
                                                <TableCell>{pedido.id}</TableCell>
                                                <TableCell>{new Date(pedido.fechapedido).toLocaleDateString()}</TableCell>
                                                <TableCell>{pedido.cliente}</TableCell>
                                                <TableCell>${pedido.precio_total.total_price.toFixed(2)}</TableCell>
                                                <TableCell>
                                                    {pedido.destinos.map((destino, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={destino}
                                                            sx={{
                                                                margin: '2px',
                                                                backgroundColor: '#8edf8e',
                                                                color: '#333'
                                                            }}
                                                        />
                                                    ))}
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="outlined"
                                                        onClick={() => handlePedidoClick(pedido)}
                                                        size="small"
                                                    >
                                                        Ver Detalles
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    ))
                ) : (
                    <Paper sx={{ p: 3, mt: 2 }}>
                        <Typography>No hay hojas de ruta para esta fecha.</Typography>
                    </Paper>
                )}

                <PedidoDetailModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    pedido={selectedPedido}
                />
            </Box>
        </Container>
    );
}

export default ConductorList;