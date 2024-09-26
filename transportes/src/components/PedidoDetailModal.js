import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const PedidoDetailModal = ({ open, onClose, pedido }) => {
  if (!pedido) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Detalles del Pedido #{pedido.id}</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          <strong>Fecha:</strong> {new Date(pedido.fechapedido).toLocaleString()}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Cliente:</strong> {pedido.cliente}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Precio Total:</strong> ${pedido.precio_total.toFixed(2)}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Paquetes:
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Peso</TableCell>
                <TableCell>Tamaño</TableCell>
                <TableCell>Localidad de Destino</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pedido.paquetes.map((paquete, index) => (
                <TableRow key={index}>
                  <TableCell>{paquete.peso}</TableCell>
                  <TableCell>{paquete.tamaño}</TableCell>
                  <TableCell>{paquete.localidad_fin}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
};

export default PedidoDetailModal;