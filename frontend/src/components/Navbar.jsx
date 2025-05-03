import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import { CssBaseline } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart';
import HistoryIcon from '@mui/icons-material/History';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ReportIcon from '@mui/icons-material/Report';
import ArticleIcon from '@mui/icons-material/Article';

const drawerWidth = 240;

export default function Navbar({ onLogout }) {
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Tablero
          </Typography>
          <Button color="inherit" onClick={onLogout}>Cerrar Sesión</Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <ListItem key="1" disablePadding>
            <ListItemButton component={Link} to="/" selected={"/" === location.pathname}>
              <ListItemIcon><StackedBarChartIcon /></ListItemIcon>
              <ListItemText primary="Estacionamiento" />
            </ListItemButton>
          </ListItem>
          <ListItem key="2" disablePadding>
            <ListItemButton component={Link} to="/PaginaRegistros" selected={"/PaginaRegistros" === location.pathname}>
              <ListItemIcon><HistoryIcon /></ListItemIcon>
              <ListItemText primary="Historial de Registros" />
            </ListItemButton>
          </ListItem>
          <ListItem key="3" disablePadding>
            <ListItemButton component={Link} to="/PaginaUsuarios" selected={"/PaginaUsuarios" === location.pathname}>
              <ListItemIcon><PeopleAltIcon /></ListItemIcon>
              <ListItemText primary="Usuarios" />
            </ListItemButton>
          </ListItem>
          <ListItem key="4" disablePadding>
            <ListItemButton component={Link} to="/PaginaAutos" selected={"/PaginaAutos" === location.pathname}>
              <ListItemIcon><DirectionsCarIcon /></ListItemIcon>
              <ListItemText primary="Vehiculos" />
            </ListItemButton>
          </ListItem>
          <ListItem key="5" disablePadding>
            <ListItemButton component={Link} to="/PaginaIncidencias" selected={"/PaginaIncidencias" === location.pathname}>
              <ListItemIcon><ReportIcon /></ListItemIcon>
              <ListItemText primary="Incidencias" />
            </ListItemButton>
          </ListItem>
          <ListItem key="6" disablePadding>
            <ListItemButton component={Link} to="/PaginaReportes" selected={"/PaginaReportes" === location.pathname}>
              <ListItemIcon><ArticleIcon /></ListItemIcon>
              <ListItemText primary="Reportes" />
            </ListItemButton>
          </ListItem>
        </Box>
      </Drawer>
    </Box>
  );
}
