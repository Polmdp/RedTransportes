// src/components/Home.js
import React from 'react';
import { Typography, Box, Grid, Button, Card, CardContent, CardActions, CardMedia } from '@mui/material';
import { Link } from 'react-router-dom';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ListAltIcon from '@mui/icons-material/ListAlt';
import RouteIcon from '@mui/icons-material/Route';
import PersonIcon from '@mui/icons-material/Person';
const Home = () => {
    return (
        <Box sx={{ mt: 5, textAlign: 'center' }}>
            <Typography variant="h3" gutterBottom>
                Bienvenido a la Red de Transportes
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                Gestión de conductores, pedidos y rutas de forma eficiente.
            </Typography>

            <Grid container spacing={4} sx={{ mt: 3 }} justifyContent="center">
                {/* Sección de Conductores */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card elevation={3}>
                        <CardMedia>
                            <DirectionsCarIcon sx={{ fontSize: 60, color: 'primary.main', mt: 2 }} />
                        </CardMedia>
                        <CardContent>
                            <Typography variant="h5" component="div" gutterBottom>
                                Conductores
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Administra los conductores de tu flota de transporte y visualiza la lista de conductores activos.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" variant="contained" color="primary" component={Link} to="/conductores">
                                Ver Conductores
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                {/* Sección de Nuevo Pedido */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card elevation={3}>
                        <CardMedia>
                            <AssignmentIcon sx={{ fontSize: 60, color: 'primary.main', mt: 2 }} />
                        </CardMedia>
                        <CardContent>
                            <Typography variant="h5" component="div" gutterBottom>
                                Nuevo Pedido
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Crea y gestiona nuevos pedidos de forma rápida y sencilla.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" variant="contained" color="primary" component={Link} to="/nuevoPedido">
                                Crear Pedido
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                {/* Sección de Lista de Pedidos */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card elevation={3}>
                        <CardMedia>
                            <ListAltIcon sx={{ fontSize: 60, color: 'primary.main', mt: 2 }} />
                        </CardMedia>
                        <CardContent>
                            <Typography variant="h5" component="div" gutterBottom>
                                Lista de Pedidos
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Consulta todos los pedidos registrados y verifica su estado.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" variant="contained" color="primary" component={Link} to="/listaPedidos">
                                Ver Pedidos
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                {/* Sección de Hoja de Ruta */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card elevation={3}>
                        <CardMedia>
                            <RouteIcon sx={{ fontSize: 60, color: 'primary.main', mt: 2 }} />
                        </CardMedia>
                        <CardContent>
                            <Typography variant="h5" component="div" gutterBottom>
                                Hoja de Ruta
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Organiza y consulta las hojas de ruta para una entrega eficiente.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" variant="contained" color="primary" component={Link} to="/hojaDeruta">
                                Ver Hojas de Ruta
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Card elevation={3}>
                        <CardMedia>
                            <PersonIcon sx={{ fontSize: 60, color: 'primary.main', mt: 2 }} />
                        </CardMedia>
                        <CardContent>
                            <Typography variant="h5" component="div" gutterBottom>
                                Clientes
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                               Administra los clientes de tu flota de transporte y visualiza la lisa de clientes
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" variant="contained" color="primary" component={Link} to="/clientes">
                                Ver Clientes
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Home;
