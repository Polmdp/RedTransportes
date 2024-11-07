import React from 'react';
import {AppBar, Toolbar, Typography, Button, Container, Box} from '@mui/material';
import ConductorList from './components/ConductoresList';
import PedidoForm from './components/PedidoForm';
import PedidosList from './components/PedidosList';
import {BrowserRouter as Router, Route, Routes, Link, Navigate} from 'react-router-dom';
import HojaDeRutaList from './components/HojaDeRutaList';
import Home from './components/Home';
import Clientes from './components/ClientesList';

// En las rutas

function App() {
    return (
        <Router>
            <AppBar position="static">
                <Toolbar>
                     <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          Red De Transportes
        </Typography>

                    {/* Usa el componente Link de react-router-dom */}

                    <Button color="inherit" component={Link} to="/conductores">
                        Conductores
                    </Button>
                    <Button color="inherit" component={Link} to="/nuevoPedido">
                        Nuevo Pedido
                    </Button>

                    <Button color="inherit" component={Link} to="/clientes">
                        Clientes
                    </Button>
                    <Button color="inherit" component={Link} to="/hojaDeruta">
                        Hoja de ruta
                    </Button>
                </Toolbar>
            </AppBar>

            <Container>
                <Box mt={3}>
                    {/* Configura las rutas para cada componente */}
                    <Routes>

                        <Route path="/" element={<Home/>}/>
                        <Route path="/conductores" element={<ConductorList/>}/>
                        <Route path="/nuevoPedido" element={<PedidoForm/>}/>
                        <Route path="/listaPedidos" element={<PedidosList/>}/>
                        <Route path="/"
                               element={<Navigate to="/conductores"/>}/>{/* Redirige a conductores por defecto */}
                        <Route path="/hojaderuta" element={<HojaDeRutaList/>}/>
                    <Route path="/clientes" element={<Clientes />} />

                    </Routes>
                </Box>
            </Container>
        </Router>
    );
}

export default App;
