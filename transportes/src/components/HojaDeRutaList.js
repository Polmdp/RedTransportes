import axios from "axios";
import React, {useEffect, useState} from "react";
import dayjs from 'dayjs';
import {Box, TextField, Typography} from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';

function ConductorList() {
    const [hojasDeRuta,setHojasDeRuta]=useState([])
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const fetchHojaDeRuta = async () => {
        try {
            const response = await axios.get('http://localhost:8000/RedTransportes/api/hojaderuta/');
            console.log("Response", response)
            setHojasDeRuta(response.data);
            console.log(response.data)
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
                        <Typography variant="h6">Hoja de Ruta: {hoja.id}</Typography>
                         <Typography>Fecha de Partida: {formatDate(hoja.fecha_partida)}</Typography>
      <Typography>Fecha de Destino: {formatDate(hoja.fecha_destino)}</Typography>

                        {hoja.pedidos.map((pedido) => (
                            <Box key={pedido.id} mt={2}>
                                <Typography variant="subtitle1">Pedido: {pedido.id}</Typography>
                                {pedido.paquetes.map((paquete) => (
                                    <Typography key={paquete.id}>
                                        Paquete: {paquete.id} - Peso: {paquete.peso} - Tamaño: {paquete.tamaño}
                                    </Typography>
                                ))}
                            </Box>
                        ))}
                    </Box>
                ))
            ) : (
                <Typography mt={2}>No hay hojas de ruta para esta fecha.</Typography>
            )}
        </Box>
    )
}

export default ConductorList;
