import React, {useState} from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import ConductorList from './components/ConductoresList';
import PedidoForm from './components/PedidoForm';
import PedidosList from './components/PedidosList';

function App() {
  const [currentPage, setCurrentPage] = useState('conductores');

  const renderPage = () => {
    switch(currentPage) {
      case 'conductores':
        return <ConductorList />;
      case 'nuevoPedido':
        return <PedidoForm />;
      case 'listaPedidos':
        return <PedidosList />;
      default:
        return <Typography>Selecciona una opción del menú</Typography>;
    }
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Red De Transportes
          </Typography>
          <Button color="inherit" onClick={() => setCurrentPage('conductores')}>
            Conductores
          </Button>
          <Button color="inherit" onClick={() => setCurrentPage('nuevoPedido')}>
            Nuevo Pedido
          </Button>
          <Button color="inherit" onClick={() => setCurrentPage('listaPedidos')}>
            Lista de Pedidos
          </Button>
        </Toolbar>
      </AppBar>
      <Container>
        <Box mt={3}>
          {renderPage()}
        </Box>
      </Container>
    </div>
  );
}

export default App;