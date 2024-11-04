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
 Chip,
 Box,
 IconButton,
 DialogActions,
 Button,
 Grid
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const PedidoDetailModal = ({ open, onClose, pedido }) => {
 if (!pedido) return null;

 console.log('Pedido:', pedido);

 const renderStatus = (status) => {
   // Si status es un string directo
   let statusCode = status;

   // Si status es un objeto (como lo definimos en el serializer)
   if (typeof status === 'object' && status !== null) {
     statusCode = status.code;
   }

   const statusConfig = {
     'CREADO': { color: 'info', label: 'Creado' },
     'EN_RUTA': { color: 'warning', label: 'En Ruta' },
     'ENTREGADO': { color: 'success', label: 'Entregado' },
     'CANCELADO': { color: 'error', label: 'Cancelado' }
   };

   const config = statusConfig[statusCode] || { color: 'default', label: statusCode || 'Desconocido' };

   return (
     <Chip
       label={config.label}
       color={config.color}
       size="small"
     />
   );
 };

 return (
   <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
     <DialogTitle>
       <Box display="flex" justifyContent="space-between" alignItems="center">
         <Typography variant="h6">
           Pedido #{pedido.id}
         </Typography>
         <IconButton onClick={onClose} size="small">
           <CloseIcon />
         </IconButton>
       </Box>
     </DialogTitle>
     <DialogContent>
       <Box mb={3}>
         <Grid container spacing={2}>
           <Grid item xs={12} sm={6}>
             <Typography variant="body1" gutterBottom>
               <strong>Fecha:</strong> {new Date(pedido.fechapedido).toLocaleString()}
             </Typography>
             <Typography variant="body1" gutterBottom>
               <strong>Cliente:</strong> {pedido.cliente}
             </Typography>
           </Grid>
           <Grid item xs={12} sm={6}>
             <Typography variant="body1" gutterBottom>
               <strong>Estado:</strong> {renderStatus(pedido.status)}
             </Typography>
             <Typography variant="body1" gutterBottom>
               <strong>Precio Total:</strong> ${pedido.precio_total.toFixed(2)}
             </Typography>
           </Grid>
         </Grid>
       </Box>

       <Typography variant="h6" gutterBottom>
         Paquetes
       </Typography>
       <TableContainer component={Paper} variant="outlined">
         <Table size="small">
           <TableHead>
             <TableRow>
               <TableCell><strong>ID</strong></TableCell>
               <TableCell><strong>Peso</strong></TableCell>
               <TableCell><strong>Tamaño</strong></TableCell>
               <TableCell><strong>Destino</strong></TableCell>
             </TableRow>
           </TableHead>
           <TableBody>
             {pedido.paquetes.map((paquete, index) => (
               <TableRow key={index}>
                 <TableCell>{paquete.id}</TableCell>
                 <TableCell>{paquete.peso} kg</TableCell>
                 <TableCell>{paquete.tamaño} m³</TableCell>
                 <TableCell>{paquete.localidad_fin_nombre}</TableCell>
               </TableRow>
             ))}
           </TableBody>
         </Table>
       </TableContainer>

       {pedido.destinos && pedido.destinos.length > 0 && (
         <Box mt={2}>
           <Typography variant="body2" color="textSecondary">
             <strong>Destinos:</strong> {pedido.destinos.join(', ')}
           </Typography>
         </Box>
       )}
     </DialogContent>
     <DialogActions>
       <Button onClick={onClose}>Cerrar</Button>
     </DialogActions>
   </Dialog>
 );
};

export default PedidoDetailModal;