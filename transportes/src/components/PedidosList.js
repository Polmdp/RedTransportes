import React, { useState, useEffect } from 'react';
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
  Button,
} from '@mui/material';
import axios from 'axios';
import PedidoDetailModal from './PedidoDetailModal';

const PedidosList = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      const response = await axios.get('http://localhost:8000/RedTransportes/api/pedidos/');
      setPedidos(response.data);
      console.log(response.data)
      setLoading(false);
    } catch (err) {
      console.error('Error al obtener los pedidos:', err);
      setError('Hubo un error al cargar los pedidos.');
      setLoading(false);
    }
  };

  const handlePedidoClick = (pedido) => {
    setSelectedPedido(pedido);
    setModalOpen(true);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Lista de Pedidos
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Precio Total</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pedidos.map((pedido) => (
              <TableRow key={pedido.id}>
                <TableCell>{pedido.id}</TableCell>
                <TableCell>{new Date(pedido.fechapedido).toLocaleDateString()}</TableCell>
                <TableCell>{pedido.cliente}</TableCell>
                <TableCell>${pedido.precio_total.total_price.toFixed(2)}</TableCell>
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
    </div>
  );
};

export default PedidosList;