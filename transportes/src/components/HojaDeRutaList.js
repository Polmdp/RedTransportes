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
    Chip
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
        dayjs(hoja.fecha_partida).isSame(selectedDate, 'day')
    );

    const handlePedidoClick = (pedido) => {
        setSelectedPedido(pedido);
        setModalOpen(true);
    };

    return (
        <Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label="Select Date"
                    value={selectedDate}
                    onChange={(newDate) => setSelectedDate(newDate)}
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>

            {filteredHojasDeRuta.length > 0 ? (
                filteredHojasDeRuta.map((hoja) => (
                    <Box key={hoja.id} mt={3}>
                        <Typography variant="h5">
                            Hoja de Ruta: {hoja.ruta.localidad_inicio.nombre} - {hoja.ruta.localidad_fin.nombre}
                        </Typography>
                        <Typography variant="h6">Localidades Intermedias</Typography>

                        <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                            {hoja.ruta.localidades_intermedias.map((loc) => (
                                <Chip sx={{
                                    backgroundColor: '#0569cb',
                                    color: '#fff', margin: '3px'
                                }} key={loc.id} label={loc.nombre}/>
                            ))}
                        </Box>
                        <Typography sx={{margin: '5px'}}>Fecha de Partida: {formatDate(hoja.fecha_partida)}</Typography>
                        <Typography sx={{margin: '5px'}}>Fecha de Destino: {formatDate(hoja.fecha_destino)}</Typography>
                        <Typography sx={{margin: '5px'}}>Conductor
                            designado: {hoja.conductor.id} - {hoja.conductor.nombre_completo}</Typography>

                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Fecha</TableCell>
                                        <TableCell>Cliente</TableCell>
                                        <TableCell>Precio Total</TableCell>
                                        <TableCell>Destinos</TableCell>
                                        <TableCell>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {hoja.pedidos.map((pedido) => (
                                        <TableRow key={pedido.id}>
                                            <TableCell>{pedido.id}</TableCell>
                                            <TableCell>{new Date(pedido.fechapedido).toLocaleDateString()}</TableCell>
                                            <TableCell>{pedido.cliente}</TableCell>
                                            <TableCell>${pedido.precio_total.toFixed(2)}</TableCell>
                                            <TableCell>
                                                {pedido.destinos.map((destino, index) => (
                                                    <Chip
                                                        key={index}
                                                        label={destino}
                                                        sx={{
                                                            margin: '2px',
                                                            backgroundColor: '#eabd90',
                                                            color: '#333'
                                                        }}
                                                    />
                                                ))}
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="outlined" onClick={() => handlePedidoClick(pedido)}>
                                                    Ver Detalles
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <PedidoDetailModal
                            open={modalOpen}
                            onClose={() => setModalOpen(false)}
                            pedido={selectedPedido}
                        />
                    </Box>
                ))
            ) : (
                <Typography mt={2}>No hay hojas de ruta para esta fecha.</Typography>
            )}
        </Box>
    );
}

export default ConductorList;
